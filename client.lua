local stancedVehicles = {}

local function ceil(num, decimal_places)
  local multiplier = 10^(decimal_places or 0)
  return math.floor(num * multiplier) / multiplier
end

local function DisplayHelpText(text, loop, duration)
  ClearAllHelpMessages()
  BeginTextCommandDisplayHelp(text)
  EndTextCommandDisplayHelp(0, loop, true, duration)
end

local function getCurrentVeh()
  return GetVehiclePedIsIn(PlayerPedId(), false)
end

local function canModify(vehicle, class, field)
  local before = GetVehicleHandlingFloat(vehicle, class, field)
  SetVehicleHandlingFloat(vehicle, class, field, before+0.01)
  if GetVehicleHandlingFloat(vehicle, class, field) == before then return false end
  SetVehicleHandlingFloat(vehicle, class, field, before)
  return true
end

local function getHandlingOrNil(vehicle, class, field)
  local can = canModify(vehicle, class, field)
  if not can then return nil end
  return GetVehicleHandlingFloat(vehicle, class, field)
end

local function getWheelSizeOrNil(vehicle)
  local original = GetVehicleWheelSize(vehicle)
  if not SetVehicleWheelSize(vehicle, original+0.1) then return nil end
  SetVehicleWheelSize(vehicle, original)
  return original
end

local function getWheelWidthOrNil(vehicle)
  local original = GetVehicleWheelWidth(vehicle)
  if not SetVehicleWheelWidth(vehicle, original+0.1) then return nil end
  SetVehicleWheelWidth(vehicle, original)
  return original
end

local function getHandlings(vehicle)
  local height = GetVehicleSuspensionHeight(vehicle)
  local offsetFront = GetVehicleWheelXOffset(vehicle, 1)
  local offsetRear = GetVehicleWheelXOffset(vehicle, 3)
  local camberFront = getHandlingOrNil(vehicle, 'CCarHandlingData', 'fCamberFront')
  local camberRear = getHandlingOrNil(vehicle, 'CCarHandlingData', 'fCamberRear')
  local wheelSize = getWheelSizeOrNil(vehicle)
  local wheelWidth = getWheelWidthOrNil(vehicle)

  return height, offsetFront, offsetRear, camberFront, camberRear, wheelSize, wheelWidth
end

local function createFakeVeh(ref)
  local modelHash = GetEntityModel(ref)
  local veh = CreateVehicle(modelHash, 0, 0, 0, 0, false, false)
  SetEntityVisible(veh, false, false)
  SetEntityInvincible(veh, true)
  SetVehicleModKit(veh, 0)
  SetVehicleWheelType(veh, GetVehicleWheelType(ref))
  SetVehicleMod(veh, 23, GetVehicleMod(ref, 23), GetVehicleModVariation(ref, 23))
  SetVehicleMod(veh, 24, GetVehicleMod(ref, 24), GetVehicleModVariation(ref, 23))
  Wait(1)
  return veh
end

RegisterCommand("stance", function()
  local vehicle = getCurrentVeh()
  if vehicle == 0 then
    DisplayHelpText("STANCEKIT_HELP_OPEN_NEED_IN_CAR", false, 7000)
    return
  end
  local state = Entity(vehicle).state
  if not state.vehicle_stance then
    DisplayHelpText("STANCEKIT_HELP_NEED_KIT", false, 7000)
    return
  end
  local fakeVeh = createFakeVeh(vehicle)
  local rH, rOF, rOR, rCF, rCR, rWS, rWW = getHandlings(fakeVeh)
  DeleteVehicle(fakeVeh)
  local cH, cOF, cOR, cCF, cCR, cWS, cWW = getHandlings(vehicle)
  SendNUIMessage({
    type = "localization",
    locale = NuiLocales
  })
  SendNUIMessage({
    type = "hud",
    showHud = true,
    height = cH,
    offsetFront = cOF,
    offsetRear = cOR,
    camberFront = cCF,
    camberRear = cCR,
    wheelSize = cWS,
    wheelWidth = cWW,
    isLinked_offset = state.vehicle_stance.isLinked_offset,
    isLinked_camber = state.vehicle_stance.isLinked_camber,
    defaultValues = {
      height = rH,
      offsetFront = rOF,
      offsetRear = rOR,
      camberFront = rCF,
      camberRear = rCR,
      wheelSize = rWS,
      wheelWidth = rWW,
    }
  })
  SetNuiFocus(true, true)
end, false)

RegisterNUICallback("ok", function(data, cb)
  SendNUIMessage({
    type = "hud",
    showHud = false
  })
  SetNuiFocus(false, false)
  cb(true)
end)

RegisterNUICallback("setVal", function(data, cb)
  local state = Entity(getCurrentVeh()).state
  local stance = state.vehicle_stance
  if not stance then cb(true) return end
  if stance[data.type] and data.defaultVal and not data.val then
    stance[data.type] = data.defaultVal
  elseif data.val then
    stance[data.type] = data.val
  end
  state:set("vehicle_stance", stance, true)
  cb(true)
end)

RegisterNUICallback("setToggle", function(data, cb)
  local state = Entity(getCurrentVeh()).state
  local stance = state.vehicle_stance
  if not stance then cb(true) return end
  stance[data.type] = data.val
  state:set("vehicle_stance", stance, true)
  cb(true)
end)

AddStateBagChangeHandler('vehicle_stance', nil, function(bagName, key, value)
  local entity = GetEntityFromStateBagName(bagName)
  if not DoesEntityExist(entity) then return end
  stancedVehicles[entity] = value
end)

CreateThread(function()
  while true do
    for veh, val in pairs(stancedVehicles) do
      if not DoesEntityExist(veh) then
        stancedVehicles[veh] = nil
      else
        if val.height then SetVehicleSuspensionHeight(veh, val.height) end
        if val.offsetFront then
          SetVehicleWheelXOffset(veh, 0, -val.offsetFront)
          SetVehicleWheelXOffset(veh, 1, val.offsetFront)
        end
        if val.offsetRear then
          SetVehicleWheelXOffset(veh, 2, -val.offsetRear)
          SetVehicleWheelXOffset(veh, 3, val.offsetRear)
        end
        if val.camberFront then SetVehicleHandlingFloat(veh, 'CCarHandlingData', 'fCamberFront', val.camberFront) end
        if val.camberRear then SetVehicleHandlingFloat(veh, 'CCarHandlingData', 'fCamberRear', val.camberRear) end
        if val.wheelSize then
          SetVehicleWheelSize(veh, val.wheelSize)
          for i = 0,3 do
            SetVehicleWheelRimColliderSize(veh, i, ceil(val.wheelSize/2, 2))
            SetVehicleWheelTireColliderSize(veh, i, ceil(val.wheelSize/2, 2))
          end
        end
        if val.wheelWidth then
          SetVehicleWheelWidth(veh, val.wheelWidth)
          for i = 0,3 do SetVehicleWheelTireColliderWidth(veh, i, ceil(val.wheelWidth, 2)) end
        end
      end
    end
    Wait(0)
  end
end)

RegisterNetEvent("az:stancekit:showHelp", function (helpText)
  DisplayHelpText(helpText, false, 7000)
end)

AddEventHandler('gameEventTriggered', function (name, args)
	if name == 'CEventNetworkPlayerEnteredVehicle' then
		if args[1] == PlayerId() then
      NetworkRegisterEntityAsNetworked(args[2])
      local netId = ObjToNet(args[2])
      SetNetworkIdCanMigrate(netId, true)
      Wait(100)
      TriggerServerEvent("az:stance:enteredVehicle", netId, GetVehicleNumberPlateText(args[2]))
		end
	end
end)
