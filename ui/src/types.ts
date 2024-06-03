export type TunableItems = {
  [key in StanceParamType]: number | null
}

export type IsLinkedItems = {
  [key in IsLinkedParamType]: boolean
}

export type SetIsLinkedItems = {
  [key in SetIsLinkedParamType]: (val: boolean) => void
}

type HudEventDataType = ({
  type: "hud"
  showHud: true
  isLinkedOffset: boolean
  isLinkedCamber: boolean
  defaultValues: TunableItems
} & TunableItems & IsLinkedItems) | {
  type: "hud"
  showHud: false
}

type LocalizationEventDataType = {
  type: "localization"
  locale: Record<string, string>
}

export type EventDataType = HudEventDataType | LocalizationEventDataType

export const linkParams = ["offset", "camber"] as const
export const sidedParams = ["Front", "Rear"] as const
export type LinkParamType = typeof linkParams[number]
export type SidedParamType = typeof sidedParams[number]
export type SidedLinkParamType = `${LinkParamType}${SidedParamType}`
export type IsLinkedParamType = `isLinked_${LinkParamType}`

export const sidedLinkParams = linkParams.flatMap(link => 
  sidedParams.map(side => `${link}${side}` as SidedLinkParamType)
)
export const linkNames = linkParams.flatMap(link => `isLinked_${link}` as IsLinkedParamType)
export type SetIsLinkedParamType = `set_${typeof linkNames[number]}`
export type SidedStanceParams = typeof sidedLinkParams[number]

export const stanceParams = ["height", "wheelSize", "wheelWidth", ...sidedLinkParams] as const
export type StanceParamType = typeof stanceParams[number]
export type SetStanceParamType = `set_${typeof stanceParams[number]}`
