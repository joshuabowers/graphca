import React, { useEffect, useState } from 'react';
import { useAppDispatch, AppDispatch } from '../../app/hooks';
import { keyPress } from '../Terminal/Terminal.slice';
import { Mode, ModeProps, ModeType } from '../Mode';
import styles from './Key.module.css';

export interface KeyProps {
  default: ModeProps,
  alpha?: ModeProps,
  shift?: ModeProps,
  modeOverride?: 'shift' | 'alpha'
}

export const createKeyPress = (value: string) =>
  (dispatch: AppDispatch) => dispatch(keyPress(value))

export const Key = (props: KeyProps) => {
  const dispatch = useAppDispatch();
  const keyMode: ModeType = props.modeOverride ?? 'default' //useAppSelector(state => state.keyMode);
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
        <Mode type='default' {...props.default} />
      </div>
    </button>
  )
}
