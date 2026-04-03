ESX = exports["es_extended"]:getSharedObject()

-- ABSOLUTES SICHERHEITSNETZ
Citizen.CreateThread(function()
    if Config == nil then Config = {} end
    if Config.Locale == nil then Config.Locale = 'de' end
    if Config.EnableCash == nil then Config.EnableCash = true end
    if Config.EnableBank == nil then Config.EnableBank = true end
    if Config.EnableSpeedo == nil then Config.EnableSpeedo = true end
    if Config.EnableFuel == nil then Config.EnableFuel = true end
    if Config.EnableStamina == nil then Config.EnableStamina = true end
    if Config.EnableOxygen == nil then Config.EnableOxygen = true end
    
    if Locales == nil then Locales = {} end
    if Locales[Config.Locale] == nil then Locales[Config.Locale] = {} end
end)

-- Schicke Config & Übersetzungen ans UI
Citizen.CreateThread(function()
    Citizen.Wait(1500)
    local translations = Locales[Config.Locale] or {}
    SendNUIMessage({ type = "setupConfig", config = Config, locale = translations })
end)

-- Main Loop: Status, Geld & Spieler ID
Citizen.CreateThread(function()
    while true do
        local player = PlayerPedId()
        local playerData = ESX.GetPlayerData()
        local cash, bank = 0, 0

        if playerData and playerData.accounts then
            for _, account in pairs(playerData.accounts) do
                if account.name == 'money' then cash = account.money end
                if account.name == 'bank' then bank = account.money end
            end
        end

        local hunger, thirst = 0, 0
        TriggerEvent('esx_status:getStatus', 'hunger', function(status) if status then hunger = status.getPercent() end end)
        TriggerEvent('esx_status:getStatus', 'thirst', function(status) if status then thirst = status.getPercent() end end)

        local stamina = GetPlayerSprintStaminaRemaining(PlayerId())
        local isUnderwater = IsPedSwimmingUnderWater(player)
        local oxygen = 100
        if isUnderwater then
            oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10
        end

        SendNUIMessage({
            type = "updateStatus",
            id = GetPlayerServerId(PlayerId()),
            health = (GetEntityHealth(player) - 100),
            armor = GetPedArmour(player),
            hunger = hunger,
            thirst = thirst,
            stamina = stamina,
            isUnderwater = isUnderwater,
            oxygen = oxygen
        })
        
        SendNUIMessage({ type = "updateMoney", cash = cash, bank = bank })
        Citizen.Wait(500) -- Etwas schneller, damit die Ausdauer flüssig aussieht
    end
end)

-- Speedo Loop
Citizen.CreateThread(function()
    while true do
        local sleep = 500
        local player = PlayerPedId()
        
        if Config.EnableSpeedo and IsPedInAnyVehicle(player, false) and not IsPauseMenuActive() then
            sleep = 50
            local veh = GetVehiclePedIsIn(player, false)
            SendNUIMessage({
                type = "updateSpeedo",
                show = true,
                speed = math.floor(GetEntitySpeed(veh) * 3.6),
                fuel = Config.EnableFuel and GetVehicleFuelLevel(veh) or 100
            })
        else
            SendNUIMessage({type = "updateSpeedo", show = false})
        end
        Citizen.Wait(sleep)
    end
end)

RegisterCommand('hud', function()
    SetNuiFocus(true, true)
    SendNUIMessage({type = "openConfig"})
end)

RegisterNUICallback('closeConfig', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Anti-Stuck Notfall System
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsNuiFocused() then
            if IsControlJustReleased(0, 322) or IsControlJustReleased(0, 202) then
                SetNuiFocus(false, false)
                SendNUIMessage({ type = "forceClose" })
            end
        else
            Citizen.Wait(500)
        end
    end
end)