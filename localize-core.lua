local languages = {
  "en",
  "fr",
  "de",
  "it",
  "es",
  "pt-br",
  "pl",
  "ru",
  "ko",
  "tw",
  "ja",
  "mx",
  "cn"
}

local _lang = nil

-- maintain detect changed language
CreateThread(function()
  while true do
    Wait(1000)
    local lang = GetCurrentLanguage()
    if _lang ~= lang then
      _lang = lang
      TriggerEvent("changedLanguage", languages[lang+1])
    end
  end
end)
