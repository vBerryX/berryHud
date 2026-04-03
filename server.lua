-- Get the name of the resource
local resourceName = GetCurrentResourceName()

-- Get the current version from the fxmanifest.lua
local currentVersion = GetResourceMetadata(resourceName, 'version', 0)

-- IMPORTANT: Put the RAW link to your version.json on GitHub here!
local githubRawUrl = "https://raw.githubusercontent.com/vBerryX/berryHud/refs/heads/main/version.json"

Citizen.CreateThread(function()
    -- Wait 2 seconds for the server to fully boot up
    Citizen.Wait(2000)

    -- Abort if no version is found in fxmanifest.lua
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

        -- Convert the text from GitHub into a readable Lua table
        local data = json.decode(resultData)

        -- Check if JSON was read successfully and contains a version
        if data and data.version then
            -- Remove invisible characters (like line breaks)
            local latestVersion = data.version:gsub("%s+", "")
            local current = currentVersion:gsub("%s+", "")

            -- Compare versions
            if latestVersion ~= current then
                print("\n^3-------------------------------------------------------------------^7")
                print("^1[UPDATE AVAILABLE] ^7- ^5" .. resourceName .. "^7")
                print("A new update is available on GitHub!")
                print("Current Version: ^1" .. current .. "^7")
                print("Latest Version:  ^2" .. latestVersion .. "^7")
                
                -- Show patchnotes if they exist in the JSON
                if data.notes then
                    print("Patchnotes: ^6" .. data.notes .. "^7")
                end
                
                print("^3Please download the latest version to avoid bugs.^7")
                print("^3-------------------------------------------------------------------\n^7")
            else
                print("^2[" .. resourceName .. "]^7 Version ^2" .. current .. "^7 is up to date!")
            end
        else
            print("^1[" .. resourceName .. "]^7 Error: Could not read version.json properly!")
        end
    end, "GET", "", "")
end)