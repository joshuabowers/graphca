import React from 'react';
import { useAppDispatch, AppDispatch } from '../../app/hooks';
import styles from './Key.module.css';

export enum Unicode {
  derivative = "\u2202",
  integral = "\u222b",
  squareRoot = "\u221a",
  plusMinus = "\u00b1",
  minus = "\u2212",
  multiplication = "\u00d7",
  division = "\u00f7",
  i = "\ud835\udc8a",
  e = "\ud835\udc86",
  x = "\ud835\udc99",
  y = "\ud835\udc9a",
  pi = "\ud835\uded1"
}

export const functions = {
  eX: <span>{ Unicode.e }<span>{ Unicode.x }</span></span>,
  invert: <span>{ Unicode.x }<span>-1</span></span>,
  squared: <span>{ Unicode.x }<span>2</span></span>,
  xY: <span>{ Unicode.x }<span>{ Unicode.y }</span></span>
}

export interface KeyProps {
  label: string | Unicode | JSX.Element,
  icon: boolean,
  unicode: boolean,
  whenNormal?: (dispatch: AppDispatch) => void
  whenShift?: (dispatch: AppDispatch) => void
}

export const Key = (props: KeyProps) => {
  const dispatch = useAppDispatch();
  const appliedStyles: string[] = [styles.key];
  if(props.icon){
    appliedStyles.push(styles.icon, 'material-icons')
  } else if(props.unicode){
    appliedStyles.push(styles.unicode)
  } else if(typeof props.label !== "string") {
    appliedStyles.push(styles.functional)
  }
  const whenClicked = () => {
    if( props.whenNormal ){props.whenNormal(dispatch)}
  }
  return (
    <button 
      className={appliedStyles.join(' ')}
      onClick={whenClicked}
      >
      {props.label}
    </button>
  )
};