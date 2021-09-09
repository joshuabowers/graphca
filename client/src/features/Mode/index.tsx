import React from 'react';
import { useAppDispatch, AppDispatch, useAppSelector } from '../../app/hooks';
import { MathSymbols } from '../../common/MathSymbols';
import styles from './Mode.module.css';

export type ModeType = 'default' | 'alpha' | 'shift';

/**
 * Modes would be responsible for rendering their 
 * display according to current Key rules.
 */
export interface ModeProps {
  type?: ModeType,
  displayHint?: 'icon' | 'unicode' | 'functional'
  display: MathSymbols,
  onClick?: (dispatch: AppDispatch) => void
}

export const Mode = (props: ModeProps) => {
  const appliedStyles: string[] = [styles.mode];

  if( props.type ) appliedStyles.push(styles[props.type])
  if( props.displayHint ) appliedStyles.push(styles[props.displayHint])

  return (
    <span className={appliedStyles.join(' ')}>
      {props.display}
    </span>
  )
}