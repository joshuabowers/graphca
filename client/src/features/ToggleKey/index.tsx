import React, { useEffect, useState } from 'react';
import styles from './ToggleKey.module.css'

import { KeyProps } from '../Key';
import { Mode, ModeType } from '../Mode';
import { useAppDispatch } from '../../app/hooks';

export interface ToggleKeyProps extends KeyProps {
  toggled?: boolean
}

export const ToggleKey = (props: ToggleKeyProps) => {
  const dispatch = useAppDispatch()
  const keyMode: ModeType = props.modeOverride ?? 'default' 
  const appliedStyles = [styles.normal, styles[keyMode]]
  const [activated, setActivate] = useState(false)

  const handler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setActivate(true)
    props[keyMode]?.activate?.(dispatch)
  }

  useEffect(() => {
    const timer = setTimeout(() => setActivate(false), 400)
    return () => {
      clearTimeout(timer)
    }
  }, [activated])

  if(activated){ appliedStyles.push(styles.activated) }
  if(props.toggled){ appliedStyles.push(styles.toggled) }

  return (
    <label className={appliedStyles.join(' ')}>
      <input 
        type='checkbox' 
        checked={props.toggled}
        onChange={handler}
      />
      <Mode {...props.default} />
    </label>
  )
}