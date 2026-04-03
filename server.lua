-- Hole den Namen der Resource
local resourceName = GetCurrentResourceName()

-- Hole die aktuelle Version aus der fxmanifest.lua
local currentVersion = GetResourceMetadata(resourceName, 'version', 0)

-- WICHTIG: Hier kommt der RAW Link zu deiner version.json auf GitHub rein!
local githubRawUrl = "https://raw.githubusercontent.com/DEIN_GITHUB_NAME/DEIN_REPO_NAME/main/version.json"

Citizen.CreateThread(function()
    -- Wir warten 2 Sekunden, damit der Server in Ruhe hochfahren kann
    Citizen.Wait(2000)

    -- Wenn in der fxmanifest keine Version steht, brechen wir ab
    if currentVersion == nil then
        print("^1[FEHLER]^7 Keine Version in der fxmanifest.lua gefunden!")
        return
    end

    -- Sende die Anfrage an GitHub
    PerformHttpRequest(githubRawUrl, function(errorCode, resultData, resultHeaders)
        -- Fehler beim Abrufen
        if errorCode ~= 200 then
            print("^1[" .. resourceName .. "]^7 Konnte Update-Server nicht erreichen. (HTTP " .. tostring(errorCode) .. ")")
            return
        end

        -- NEU: Wir wandeln den Text aus GitHub in eine lesbare Lua-Tabelle um
        local data = json.decode(resultData)

        -- Prüfen, ob das JSON erfolgreich gelesen wurde und eine Version enthält
        if data and data.version then
            local latestVersion = data.version:gsub("%s+", "")
            local current = currentVersion:gsub("%s+", "")

            -- Vergleichen
            if latestVersion ~= current then
                print("\n^3-------------------------------------------------------------------^7")
                print("^1[UPDATE VERFÜGBAR] ^7- ^5" .. resourceName .. "^7")
                print("Ein neues Update ist auf GitHub verfuegbar!")
                print("Aktuelle Version: ^1" .. current .. "^7")
                print("Neueste Version:  ^2" .. latestVersion .. "^7")
                
                -- NEU: Wenn du "notes" im JSON hast, werden sie hier angezeigt!
                if data.notes then
                    print("Patchnotes: ^6" .. data.notes .. "^7")
                end
                
                print("^3Bitte lade die neue Version herunter, um Bugs zu vermeiden.^7")
                print("^3-------------------------------------------------------------------\n^7")
            else
                print("^2[" .. resourceName .. "]^7 Version ^2" .. current .. "^7 ist auf dem neuesten Stand!")
            end
        else
            print("^1[" .. resourceName .. "]^7 Fehler: Konnte version.json nicht richtig lesen!")
        end
    end, "GET", "", "")
end)