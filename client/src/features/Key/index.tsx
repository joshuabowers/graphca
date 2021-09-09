import React from 'react';
import { useAppDispatch, AppDispatch, useAppSelector } from '../../app/hooks';
import { keyPress } from '../Terminal/terminalSlice';
import { Mode, ModeProps, ModeType } from '../Mode';
import styles from './Key.module.css';

export interface KeyProps {
  default: ModeProps,
  alpha: ModeProps,
  shift: ModeProps
}

export const createKeyPress = (value: string) =>
  (dispatch: AppDispatch) => dispatch(keyPress(value))

export const Key = (props: KeyProps) => {
  const dispatch = useAppDispatch();
  const keyMode: ModeType = 'default' //useAppSelector(state => state.keyMode);
  const currentMode = props[keyMode];
  const handler = () => {
    if( currentMode.onClick )
      currentMode.onClick(dispatch)
  };
  return (
    <button
      className={[styles.key, styles[keyMode]].join(' ')}
      onClick={handler}
      >
      <div className={styles.meta}>
        <Mode type='shift' {...props.shift} />
        <Mode type='alpha' {...props.alpha} />
      </div>
      <div className={styles.primary}>
        <Mode type='default' {...props.default} />
      </div>
    </button>
  )
}
