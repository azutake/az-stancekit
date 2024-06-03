local QBCore = exports['qb-core']:GetCoreObject()
local stancedVehicles = {}
local lastChecked = {}

RegisterNetEvent('QBCore:Server:PlayerLoaded', function(xPlayer)
  TriggerClientEvent("az:stancekit:playerReady", xPlayer.PlayerData.source)
end)

QBCore.Functions.CreateUseableItem("stancerkit", function(source, item)
  local src = source
  local veh = GetVehiclePedIsIn(GetPlayerPed(src), false)
  if veh == 0 then
    TriggerClientEvent("az:stancekit:showHelp", src, "STANCEKIT_HELP_INSTALL_NEED_IN_CAR")
    return
  end
  if Entity(veh).state.vehicle_stance then
    TriggerClientEvent("az:stancekit:showHelp", src, "STANCEKIT_HELP_ALREADY_INSTALLED")
    return
  end
  Entity(veh).state:set("vehicle_stance", {}, true)
  local Player = QBCore.Functions.GetPlayer(src)
  if not Player then return end
  if not Player.Functions.RemoveItem("stancerkit", 1) then return end
  TriggerClientEvent("az:stancekit:showHelp", src, "STANCEKIT_HELP_INSTALL_COMPLETED")
end)

RegisterNetEvent('az:stance:enteredVehicle', function(netId, plate)
  if lastChecked[netId] then
    if lastChecked[netId] + (1000 * 60) > GetGameTimer() then return end
  end
  lastChecked[netId] = GetGameTimer()
  local entityId = NetworkGetEntityFromNetworkId(netId)
  if stancedVehicles[entityId] then return end
  print("veh checking")
  local rows = MySQL.query.await('SELECT * FROM player_vehicles WHERE plate = ? AND has_stance = 1 LIMIT 1', { plate })
  if #rows > 0 then
    print("stance kit installing")
    Entity(entityId).state:set("vehicle_stance", json.decode(rows[1].stance_mods))
  end
end)

local function saveVehicleStance(plate, data)
  MySQL.query.await('UPDATE player_vehicles SET has_stance = 1, stance_mods = ? WHERE plate = ?', { json.encode(data), plate })
  print("saved")
end

AddStateBagChangeHandler('vehicle_stance' , nil , function(bagName, key, value)
  local entity = GetEntityFromStateBagName(bagName)
  if not DoesEntityExist(entity) then return end
  if not stancedVehicles[entity] then
    stancedVehicles[entity] = {}
  end
  stancedVehicles[entity].data = value
  stancedVehicles[entity].saved = false
  stancedVehicles[entity].plate = GetVehicleNumberPlateText(entity)
end)

-- 定期存在チェック
CreateThread(function()
  while true do
    for veh, val in pairs(stancedVehicles) do
      if not DoesEntityExist(veh) then
        saveVehicleStance(val.plate, val.data)
        stancedVehicles[veh] = nil
      end
    end
    Wait(0)
  end
end)

--FIXME: remove
CreateThread(function()
  while true do
    print(json.encode(stancedVehicles))
    Wait(10 * 1000)
  end
end)

-- 定期保存処理
CreateThread(function()
  while true do
    for veh, val in pairs(stancedVehicles) do
      if not val.saved then
        saveVehicleStance(val.plate, val.data)
        stancedVehicles[veh].saved = true
      end
    end
    Wait(15 * 1000)
  end
end)
