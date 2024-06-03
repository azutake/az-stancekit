import { Accessor, Component, ParentProps, batch, createContext, createEffect, createSignal, on, useContext } from "solid-js"
import { createReceiveNUI } from "../utils"
import { EventDataType, IsLinkedParamType, SetIsLinkedParamType, StanceParamType, linkParams, stanceParams } from "../types"
import { sendToggleChange, sendValChange } from "../nuiSend"
import { useStanceCurrentValues, useStanceDefaultValues } from "./stanceValuesContext"

export type TLocaleContext = {
  getLocale: (key: string) => string
}

export const LocaleContext = createContext({} as TLocaleContext)

export const useLocale = () => useContext(LocaleContext);

export const LocaleContextProvider: Component<ParentProps> = (props) => {
  const [locales, setLocales] = createSignal<Record<string,string>>({})
  createReceiveNUI(event => {
    const data: EventDataType = event.data
    if(data.type !== "localization") return
    setLocales(data.locale)
  })
  return (
    <LocaleContext.Provider value={{
      getLocale: key => {
        return locales()[key] ?? key
      }
    }}>
      {props.children}
    </LocaleContext.Provider>
  )
}
