import { Accessor, Component, ParentProps, createContext, createSignal, useContext } from "solid-js"
import { StanceParamType, SetStanceParamType } from "../types"

export type TStanceValuesContext = {
  [key in StanceParamType]: Accessor<number | null>
} & {
  [key in SetStanceParamType]: (val: number | null) => void
}

export const StanceCurrentValuesContext = createContext({} as TStanceValuesContext)
export const useStanceCurrentValues = () => useContext(StanceCurrentValuesContext)

export const StanceDefaultValuesContext = createContext({} as TStanceValuesContext)
export const useStanceDefaultValues = () => useContext(StanceDefaultValuesContext);

export const createStanceValues = (): TStanceValuesContext => {
  const [height, set_height] = createSignal<number | null>(null)
  const [offsetFront, set_offsetFront] = createSignal<number | null>(null)
  const [offsetRear, set_offsetRear] = createSignal<number | null>(null)
  const [camberFront, set_camberFront] = createSignal<number | null>(null)
  const [camberRear, set_camberRear] = createSignal<number | null>(null)
  const [wheelSize, set_wheelSize] = createSignal<number | null>(null)
  const [wheelWidth, set_wheelWidth] = createSignal<number | null>(null)

  return {
    height, set_height,
    offsetFront, set_offsetFront,
    offsetRear, set_offsetRear,
    camberFront, set_camberFront,
    camberRear, set_camberRear,
    wheelSize, set_wheelSize,
    wheelWidth, set_wheelWidth,
  }
}

export const StanceCurrentValuesContextProvider: Component<ParentProps> = (props) => (
  <StanceCurrentValuesContext.Provider value={createStanceValues()}>
    {props.children}
  </StanceCurrentValuesContext.Provider>
)

export const StanceDefaultValuesContextProvider: Component<ParentProps> = (props) => (
  <StanceDefaultValuesContext.Provider value={createStanceValues()}>
    {props.children}
  </StanceDefaultValuesContext.Provider>
)
