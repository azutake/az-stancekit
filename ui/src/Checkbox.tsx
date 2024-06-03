import { Accessor, ParentProps, type Component } from 'solid-js';

import styles from './Checkbox.module.scss';

type CheckboxProps = {
  id: string
  value: Accessor<boolean>
  setValue: (val: boolean) => void
  disabled?: Accessor<boolean>
} & ParentProps

export const Checkbox: Component<CheckboxProps> = (props) => {
  return (
    <div class={styles.linkCheckboxContainer}>
    <div class={styles.linkCheckbox}>
      <input disabled={props.disabled && props.disabled()} checked={props.value()} type="checkbox" id={props.id} oninput={(e) => props.setValue(e.target.checked)} />
      <label for={props.id}>{props.children}</label>
    </div>
  </div>
  )
}
