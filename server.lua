-- Get the name of the resource (e.g., "my_hud")
local resourceName = GetCurrentResourceName()

-- Get the current version from the fxmanifest.lua
local currentVersion = GetResourceMetadata(resourceName, 'version', 0)

-- IMPORTANT: Put the RAW link to your version.txt on GitHub here!
-- Example: "https://raw.githubusercontent.com/YourName/YourRepo/main/version.txt"
local githubRawUrl = "https://raw.githubusercontent.com/vBerryX/berryHud/refs/heads/main/version.txt?token=GHSAT0AAAAAADZGCS7QZWAOOVLQBRXGA3OS2OQIBLQ"

Citizen.CreateThread(function()
    -- We wait 2 seconds to let the server boot up properly
    Citizen.Wait(2000)

    -- If there's no version in the fxmanifest, we abort
    if currentVersion == nil then
        print("^1[ERROR]^7 No version found in fxmanifest.lua!")
        return
    end

    -- Send the request to GitHub
    PerformHttpRequest(githubRawUrl, function(errorCode, resultData, resultHeaders)
        -- Error fetching data (e.g., no internet or wrong link)
        if errorCode ~= 200 then
            print("^1[" .. resourceName .. "]^7 Could not reach the update server. (HTTP " .. tostring(errorCode) .. ")")
            return
        end

        -- Remove invisible characters (like line breaks) from both versions
        local latestVersion = resultData:gsub("%s+", "")
        local current = currentVersion:gsub("%s+", "")

        -- Compare versions
        if latestVersion ~= current then
            print("\n^3-------------------------------------------------------------------^7")
            print("^1[UPDATE AVAILABLE] ^7- ^5" .. resourceName .. "^7")
            print("A new update is available on GitHub!")
            print("Current Version: ^1" .. current .. "^7")
            print("Latest Version:  ^2" .. latestVersion .. "^7")
            print("^3Please download the newest version to avoid bugs.^7")
            print("^3-------------------------------------------------------------------\n^7")
        else
            print("^2[" .. resourceName .. "]^7 Version ^2" .. current .. "^7 is up to date!")
        end
    end, "GET", "", "")
end)