ESX = exports["es_extended"]:getSharedObject()

-- Sicherheitsnetz: shared_scripts garantiert, dass config.lua/locales/*.lua
-- vor diesem client_script geladen sind, daher genügt normaler Code (kein Thread nötig).
if Config == nil then Config = {} end
if Config.Locale == nil then Config.Locale = 'de' end
if Config.EnableCash == nil then Config.EnableCash = true end
if Config.EnableBank == nil then Config.EnableBank = true end
if Config.EnableSpeedo == nil then Config.EnableSpeedo = true end
if Config.EnableFuel == nil then Config.EnableFuel = true end
if Config.EnableStamina == nil then Config.EnableStamina = true end
if Config.EnableOxygen == nil then Config.EnableOxygen = true end
if Config.GlitchThreshold == nil then Config.GlitchThreshold = 25 end

if Locales == nil then Locales = {} end
if Locales[Config.Locale] == nil then Locales[Config.Locale] = {} end

-- Schickt Config & Übersetzungen ans UI, sobald die NUI-Seite ihr DOM aufgebaut hat
-- (ersetzt ein früheres willkürliches Wait(1500) durch einen echten Ready-Callback)
RegisterNUICallback('uiReady', function(_, cb)
    SendNUIMessage({ type = "setupConfig", config = Config, locale = Locales[Config.Locale] })
    cb('ok')
end)

-- ==========================================
-- SICHTBARKEITS-SYSTEM (Multichar & Pause Menu)
-- ==========================================

local isPlayerLoaded = false
local isHUDVisible = false

-- Wird von ESX aufgerufen, wenn der Spieler spawnt (z.B. nach Multichar)
RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function()
    isPlayerLoaded = true
end)

-- Wird von ESX aufgerufen, wenn der Spieler den Charakter wechselt
RegisterNetEvent('esx:onPlayerLogout')
AddEventHandler('esx:onPlayerLogout', function()
    isPlayerLoaded = false
end)

-- Fallback: Falls das Script im laufenden Betrieb neu gestartet wird
-- (esx:playerLoaded feuert dann nicht erneut)
Citizen.CreateThread(function()
    Citizen.Wait(1000)
    if ESX.GetPlayerData().job ~= nil then
        isPlayerLoaded = true
    end
end)

-- Main Visibility Loop (prüft Pause-Menu & Lade-Status, sendet nur bei Änderung)
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(200)

        local shouldBeVisible = isPlayerLoaded and not IsPauseMenuActive()

        if shouldBeVisible and not isHUDVisible then
            isHUDVisible = true
            SendNUIMessage({ type = "toggleHUD", show = true })
        elseif not shouldBeVisible and isHUDVisible then
            isHUDVisible = false
            SendNUIMessage({ type = "toggleHUD", show = false })
        end
    end
end)

-- ==========================================
-- KOMMANDOS & NOTFALL SYSTEME
-- ==========================================

RegisterCommand('hud', function()
    -- Verhindert das Öffnen des Editors im Ladescreen
    if isPlayerLoaded then
        SetNuiFocus(true, true)
        SendNUIMessage({ type = "openConfig" })
    end
end)

RegisterNUICallback('closeConfig', function(_, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Anti-Stuck Notfall System (ESC drücken = Menü zu)
Citizen.CreateThread(function()
    while true do
        if IsNuiFocused() then
            Citizen.Wait(0)
            if IsControlJustReleased(0, 322) or IsControlJustReleased(0, 202) then
                SetNuiFocus(false, false)
                SendNUIMessage({ type = "forceClose" })
            end
        else
            Citizen.Wait(500)
        end
    end
end)
