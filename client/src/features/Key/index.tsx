import React from 'react';
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
  const handler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if( currentMode?.activate )
      currentMode.activate(dispatch)
  };
  const appliedStyles = [styles.normal, styles[keyMode]].join(' ');
  return (
    <button onClick={handler} className={appliedStyles}>
      <div className={styles.meta}>
        {props.shift ? <Mode type='shift' {...props.shift} /> : <span />}
        {props.alpha && <Mode type='alpha' {...props.alpha} />}
      </div>
      <div className={styles.primary}>
        <Mode type='default' {...props.default} />
      </div>
    </button>
  )
}
