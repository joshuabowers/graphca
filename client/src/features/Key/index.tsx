import React, { useEffect, useState } from 'react';
import { useAppDispatch, AppDispatch, useAppSelector } from '../../app/hooks';
import { keyPress } from '../Terminal/Terminal.slice';
import { Mode, ModeProps, ModeType } from '../Mode';
import styles from './Key.module.css';

export interface KeyProps {
  default: ModeProps,
  alphaMega?: ModeProps,
  alphaMicron?: ModeProps,
  shift?: ModeProps,
  trig?: ModeProps,
  modeOverride?: 'shift' | 'alphaMega' | 'alphaMicron' | 'trig'
}

export const createKeyPress = (value: string) =>
  (dispatch: AppDispatch) => dispatch(keyPress(value))

export const Key = (props: KeyProps) => {
  const dispatch = useAppDispatch();
  const keyMode: ModeType = 
    useAppSelector(state => state.keypad.currentMode) 
    ?? props.modeOverride 
    ?? 'default'
  const currentMode = props[keyMode];
  const appliedStyles = [styles.normal, styles[keyMode]];
  const [activated, setActivate] = useState(false)

  const handler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setActivate(true)
    if( currentMode?.activate )
      currentMode.activate(dispatch)
  };

  useEffect(() => {
    const timer = setTimeout(() => setActivate(false), 400)
    return () => {
      clearTimeout(timer)
    }
  }, [activated])

  if(activated){ appliedStyles.push(styles.activated) }

  return (
    <button 
      onClick={handler}
      className={appliedStyles.join(' ')}>
      <div className={styles.primary}>
        <Mode {...(currentMode ?? props.default)} />
      </div>
    </button>
  )
}
