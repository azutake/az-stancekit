import { Accessor, Component, ParentProps, batch, createContext, createEffect, createSignal, on, useContext } from "solid-js"
import { createReceiveNUI } from "../utils"
import { EventDataType, IsLinkedParamType, SetIsLinkedParamType, StanceParamType, linkParams, stanceParams } from "../types"
import { sendToggleChange, sendValChange } from "../nuiSend"
import { useStanceCurrentValues, useStanceDefaultValues } from "./stanceValuesContext"

export type TStanceContext = {
  isShowHud: Accessor<boolean>
  setVal: (type: StanceParamType, val: number | null) => void
} & {
  [key in IsLinkedParamType]: Accessor<boolean>
} & {
  [key in SetIsLinkedParamType]: (val: boolean) => void
}

export const StanceContext = createContext({} as TStanceContext)

export const useStance = () => useContext(StanceContext);

export const StanceContextProvider: Component<ParentProps> = (props) => {
  const [isShowHud, setIsShowHud] = createSignal(false)
  const [isLinked_offset, set_isLinked_offset] = createSignal(false)
  const [isLinked_camber, set_isLinked_camber] = createSignal(false)
  const currentVals = useStanceCurrentValues()
  const defaultVals = useStanceDefaultValues()
  createEffect(on(isLinked_offset, val => isShowHud() && sendToggleChange("isLinked_offset", val), { defer: true }))
  createEffect(on(isLinked_camber, val => isShowHud() && sendToggleChange("isLinked_camber", val), { defer: true }))
  const updateStanceParams = (data: EventDataType) => {
    batch(() => {
      if(data.type !== "hud") return
      for(const key of stanceParams) defaultVals[`set_${key}`](data.showHud ? data.defaultValues[key] ?? null : null)
      for(const key of stanceParams) {
        if(data.showHud) {
          const defVal = data.defaultValues[key]
          if(defVal === undefined || defVal === null) {
            currentVals[`set_${key}`](null)
            continue
          }
          const diff = (data[key] ?? 0) - defVal
          currentVals[`set_${key}`](data[key] ? diff : null)
        } else {
          currentVals[`set_${key}`](null)
        }
      }
    })
  }
  const updateValDiff = (type: StanceParamType, diff: number | null) => {
    currentVals[`set_${type}`](diff)
  }
  createReceiveNUI(event => {
    const data: EventDataType = event.data
    if(data.type !== "hud") return
    batch(() => {
      if(data.showHud) {
        set_isLinked_offset(data.isLinked_offset)
        set_isLinked_camber(data.isLinked_camber)
      }
      if(data.showHud) updateStanceParams(data)
      setIsShowHud(data.showHud)
      if(!data.showHud) updateStanceParams(data)
      if(!data.showHud) {
        set_isLinked_offset(false)
        set_isLinked_camber(false)
      }
    })
  })
  return (
    <StanceContext.Provider value={{
      isShowHud,
      setVal: (type, diff) => {
        batch(() => {

          if(!isShowHud()) return
          const defVal = defaultVals[type]()
          if(defVal === null) return
          const hasDiffVal = diff !== null
          const resultVal = hasDiffVal ? defVal + diff : null
          sendValChange(type, resultVal, defVal)
          if(isLinked_offset() && type.startsWith("offset")) {
            updateValDiff("offsetFront", diff)
            updateValDiff("offsetRear", diff)
          }
          if(isLinked_camber() && type.startsWith("camber")) {
            updateValDiff("camberFront", diff)
            updateValDiff("camberRear", diff)
          }
        })
      },
      isLinked_offset, set_isLinked_offset,
      isLinked_camber, set_isLinked_camber,
    }}>
      {props.children}
    </StanceContext.Provider>
  )
}
