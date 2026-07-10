-- ==========================================
-- STATUS, GELD & SPIELER-ID
-- ==========================================

local lastStatus = {}
local lastMoney = { cash = nil, bank = nil }

local function statusChanged(a, b)
    return a.id ~= b.id
        or a.health ~= b.health
        or a.armor ~= b.armor
        or a.hunger ~= b.hunger
        or a.thirst ~= b.thirst
        or a.stamina ~= b.stamina
        or a.isUnderwater ~= b.isUnderwater
        or a.oxygen ~= b.oxygen
end

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

        local isUnderwater = IsPedSwimmingUnderWater(player)
        local oxygen = 100
        if isUnderwater then
            oxygen = math.floor(GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10)
        end

        local newStatus = {
            id = GetPlayerServerId(PlayerId()),
            health = GetEntityHealth(player) - 100,
            armor = GetPedArmour(player),
            hunger = math.floor(hunger),
            thirst = math.floor(thirst),
            stamina = math.floor(GetPlayerSprintStaminaRemaining(PlayerId())),
            isUnderwater = isUnderwater,
            oxygen = oxygen
        }

        if statusChanged(lastStatus, newStatus) then
            SendNUIMessage({
                type = "updateStatus",
                id = newStatus.id,
                health = newStatus.health,
                armor = newStatus.armor,
                hunger = newStatus.hunger,
                thirst = newStatus.thirst,
                stamina = newStatus.stamina,
                isUnderwater = newStatus.isUnderwater,
                oxygen = newStatus.oxygen
            })
            lastStatus = newStatus
        end

        if cash ~= lastMoney.cash or bank ~= lastMoney.bank then
            SendNUIMessage({ type = "updateMoney", cash = cash, bank = bank })
            lastMoney = { cash = cash, bank = bank }
        end

        Citizen.Wait(500)
    end
end)

-- ==========================================
-- SPEEDO & GANG-ANZEIGE
-- ==========================================

local lastSpeedo = { show = nil, speed = nil, fuel = nil, gear = nil }

Citizen.CreateThread(function()
    while true do
        local sleep = 500
        local player = PlayerPedId()
        local newSpeedo

        if Config.EnableSpeedo and IsPedInAnyVehicle(player, false) and not IsPauseMenuActive() then
            sleep = 50
            local veh = GetVehiclePedIsIn(player, false)
            newSpeedo = {
                show = true,
                speed = math.floor(GetEntitySpeed(veh) * 3.6),
                fuel = Config.EnableFuel and math.floor(GetVehicleFuelLevel(veh)) or 100,
                gear = GetVehicleCurrentGear(veh)
            }
        else
            newSpeedo = { show = false, speed = 0, fuel = 0, gear = 0 }
        end

        if newSpeedo.show ~= lastSpeedo.show
            or newSpeedo.speed ~= lastSpeedo.speed
            or newSpeedo.fuel ~= lastSpeedo.fuel
            or newSpeedo.gear ~= lastSpeedo.gear then
            SendNUIMessage({
                type = "updateSpeedo",
                show = newSpeedo.show,
                speed = newSpeedo.speed,
                fuel = newSpeedo.fuel,
                gear = newSpeedo.gear
            })
            lastSpeedo = newSpeedo
        end

        Citizen.Wait(sleep)
    end
end)

-- ==========================================
-- VOICE-INDIKATOR
-- ==========================================

local lastTalking = nil

Citizen.CreateThread(function()
    while true do
        local isTalking = NetworkIsPlayerTalking(PlayerId())
        if isTalking ~= lastTalking then
            SendNUIMessage({ type = "updateVoice", talking = isTalking })
            lastTalking = isTalking
        end
        Citizen.Wait(150)
    end
end)
