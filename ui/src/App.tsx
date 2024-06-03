import { createEffect, createMemo, type Component } from 'solid-js';

import styles from './App.module.scss';
import { useStance } from './states/stanceContext';
import { createKeybind } from './utils';
import { sendOK } from './nuiSend';
import Fa from 'solid-fa';
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { TuningItem } from './TuningItem';
import { Checkbox } from './Checkbox';
import { useStanceCurrentValues, useStanceDefaultValues } from './states/stanceValuesContext';
import { useLocale } from './states/localeContext';

const App: Component = () => {
  const { isShowHud, setVal, ...stance } = useStance()
  const currentVals = useStanceCurrentValues()
  const defaultVals = useStanceDefaultValues()
  const canNotLinkOffset = createMemo(() => { const val = defaultVals.offsetFront(); return val === null})
  const canNotLinkCamber = createMemo(() => { const val = defaultVals.camberFront(); return val === null})
  const canModifyHeight = createMemo(() => defaultVals.height() !== null)
  const canModifyOffsetFront = createMemo(() => defaultVals.offsetFront() !== null)
  const canModifyOffsetRear = createMemo(() => defaultVals.offsetRear() !== null)
  const canModifyCamberFront = createMemo(() => defaultVals.camberFront() !== null)
  const canModifyCamberRear = createMemo(() => defaultVals.camberRear() !== null)
  const canModifyWheelSize = createMemo(() => defaultVals.wheelSize() !== null)
  const canModifyWheelWidth = createMemo(() => defaultVals.wheelWidth() !== null)
  const locale = useLocale()
  createKeybind("Escape", () => {
    sendOK()
  })
  return (
    <div class={styles.App}>
      <div class={`${styles.stanceContainer} ${isShowHud() ? styles.showStance : ""}`}>
        <div class={styles.stanceTuningContainer}>
          <div id={styles.title}>{locale.getLocale("common.title")}</div>
          <TuningItem title={locale.getLocale("tuning.height")} invert range={0.7} canModify={canModifyHeight} initValue={currentVals.height} valueChanged={v => setVal("height", v)} />
          <TuningItem title={locale.getLocale("tuning.offsetFront")} range={0.2} canModify={canModifyOffsetFront} initValue={currentVals.offsetFront} valueChanged={v => setVal("offsetFront", v)} />
          <div class={styles.linkCheckboxContainer}><Checkbox disabled={canNotLinkOffset} id="link-offset" value={stance.isLinked_offset} setValue={stance.set_isLinked_offset}><Fa icon={faLink} scale="0.8" /></Checkbox></div>
          <TuningItem title={locale.getLocale("tuning.offsetRear")} range={0.2} canModify={canModifyOffsetRear} initValue={currentVals.offsetRear} valueChanged={v => setVal("offsetRear", v)} />
          <TuningItem title={locale.getLocale("tuning.camberFront")} range={1.5} canModify={canModifyCamberFront} initValue={currentVals.camberFront} valueChanged={v => setVal("camberFront", v)} />
          <div class={styles.linkCheckboxContainer}><Checkbox disabled={canNotLinkCamber} id="link-camber" value={stance.isLinked_camber} setValue={stance.set_isLinked_camber}><Fa icon={faLink} scale="0.8" /></Checkbox></div>
          <TuningItem title={locale.getLocale("tuning.camberRear")} range={1.5} canModify={canModifyCamberRear} initValue={currentVals.camberRear} valueChanged={v => setVal("camberRear", v)} />
          <TuningItem title={locale.getLocale("tuning.wheelSize")} range={0.2} canModify={canModifyWheelSize} initValue={currentVals.wheelSize} valueChanged={v => setVal("wheelSize", v)} />
          <TuningItem title={locale.getLocale("tuning.wheelWidth")} range={0.5} canModify={canModifyWheelWidth} initValue={currentVals.wheelWidth} valueChanged={v => setVal("wheelWidth", v)} />
        </div>
        <div class={styles.tuningConfirmButtons}>
          <button onClick={sendOK}>OK</button>
        </div>
      </div>
    </div>
  )
}

export default App;
