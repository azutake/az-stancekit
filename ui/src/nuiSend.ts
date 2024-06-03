import { IsLinkedParamType, StanceParamType } from "./types"

const sendNUI = async <TBody>(path: string, body?: TBody) => {
  await fetch(`https://az-stancekit/${path}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
    body: body ? JSON.stringify(body) : undefined
  })
}

export const sendOK = async () => {
  await sendNUI("ok")
}

export const sendValChange = async (type: StanceParamType, val: number | null, defaultVal: number | null) => {
  await sendNUI("setVal", { type, val, defaultVal })
}

export const sendToggleChange = async (type: IsLinkedParamType, val: boolean) => {
  await sendNUI("setToggle", { type, val })
}
