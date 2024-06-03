import { Accessor, Component, createEffect, createMemo, createSignal } from "solid-js"
import styles from './TuningItem.module.scss';
import { useLocale } from "./states/localeContext";

type TuningItemProps = {
  title: string
  canModify: Accessor<boolean>
  initValue: Accessor<number | null>
  valueChanged?: (val: number | null) => void
  range: number
  invert?: boolean
}

export const TuningItem: Component<TuningItemProps> = (props) => {
  const locale = useLocale()
  const [value, setValue] = createSignal<number | null | undefined>(undefined)
  const valOrDefault = createMemo(() => {
    const val = value()
    return val ?? 0
  })
  const rangeMin = createMemo(() => -props.range)
  const rangeMax = createMemo(() => props.range)
  let syncing = true
  createEffect(() => {
    syncing = true
    const initVal = props.initValue()
    if(initVal === null) {
      setValue(null)
      syncing = false
      return
    }
    setValue(props.invert ? -initVal : initVal)
    syncing = false
  })
  createEffect(() => {
    const val = value()
    if(syncing) return
    if(val === undefined) return
    if(val === null) {
      props.valueChanged?.(null)
      return
    }
    props.valueChanged?.(props.invert ? -val : val)
  })
  return (
    <div class={`${styles.tuningItemContainer} ${!props.canModify() && styles.tuningItemDisabled}`}>
      <div class={styles.tuningItemContainerTitle}>{props.title}</div>
      <div class={styles.tuningItemSliderContainer}>
        <div class={styles.tuningItemSliderBack} />
        <div class={styles.tuningItemSliderBackRecommend} />
        {valOrDefault() !== null && <input class={styles.tuningItemSlider} oninput={(e) => setValue(e.target.valueAsNumber)} type="range" min={rangeMin()} max={rangeMax()} step={0.001} value={valOrDefault()} />}
      </div>
      <div class={styles.tuningItemSliderLabelContainer}>
        <span>{locale.getLocale("common.low")}</span>
        <button class={styles.tuningItemResetButton} disabled={value() === null} onclick={() => setValue(null)}>{locale.getLocale("common.reset")}</button>
        <span>{locale.getLocale("common.high")}</span>
      </div>
    </div>
  )
}
