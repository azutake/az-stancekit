NuiLocales = nil

local function changeLang(langCode)
  local file = LoadResourceFile(GetCurrentResourceName(), "locales/" .. langCode .. ".json")
  if not file then return false end
  local decoded = json.decode(file)
  for k, v in pairs(decoded.natives) do
    AddTextEntryByHash(GetHashKey(k), v)
  end
  NuiLocales = decoded.nui
  SendNUIMessage({
    type = "localization",
    locale = NuiLocales
  })
  return true
end

RegisterNetEvent("changedLanguage", function(langCode)
  if not changeLang(langCode) then changeLang("en") end
end)
