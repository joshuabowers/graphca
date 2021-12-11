import React from 'react';
import { AppDispatch } from '../../app/hooks';
import { MathSymbols } from '../../common/MathSymbols';
import styles from './Mode.module.css';

export type ModeType = 'default' | 'alphaMega' | 'alphaMicron' | 'shift' | 'trig';

export interface ModeProps {
  type?: ModeType,
  displayHint?: 'icon' | 'unicode' | 'functional' | 'verbose'
  display: MathSymbols,
  activate?: (dispatch: AppDispatch) => void
}

export const Mode = (props: ModeProps) => {
  const appliedStyles: string[] = [styles.mode];

  if( props.type ){ appliedStyles.push(styles[props.type]) }
  if( props.displayHint ){ appliedStyles.push(styles[props.displayHint]) }

  return (
    <span className={appliedStyles.join(' ')}>
      {props.display}
    </span>
  )
}