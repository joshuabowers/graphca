import React, { useEffect, useState } from 'react';
import { useAppDispatch, AppDispatch, useAppSelector } from '../../app/hooks';
import { keyPress } from '../Terminal/Terminal.slice';
import { Mode, ModeProps, ModeType } from '../Mode';
import { MathSymbols } from '../../common/MathSymbols';
import styles from './Key.module.css';

export interface KeyProps {
  default: ModeProps,
  alphaMega?: ModeProps,
  alphaMicron?: ModeProps,
  shift?: ModeProps,
  trig?: ModeProps,
  modeOverride?: 'shift' | 'alphaMega' | 'alphaMicron' | 'trig',
  disabled?: boolean
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
      disabled={props.disabled}
      onClick={handler}
      className={appliedStyles.join(' ')}>
      <div className={styles.primary}>
        <Mode {...(currentMode ?? props.default)} />
      </div>
    </button>
  )
}

const indexByType = (modes: ModeProps[]) =>
  new Map(modes.map(m => [m.type, m]))

export type ModeMap = ReturnType<typeof indexByType>;

const propsOrDisabled = (indexed: ModeMap, key: ModeType) =>
  indexed.get(key) ?? {type: key, display: ''}

export const createKey = (...modes: ModeProps[]) => {
  const indexed = indexByType(modes)
  return <Key 
    default={propsOrDisabled(indexed, 'default')} 
    shift={propsOrDisabled(indexed, 'shift')}
    alphaMega={propsOrDisabled(indexed, 'alphaMega')}
    alphaMicron={propsOrDisabled(indexed, 'alphaMicron')}
    trig={propsOrDisabled(indexed, 'trig')}
  />
}

export const commandKey = (display: MathSymbols, disabled: boolean, activate: (dispatch: AppDispatch) => void) => {
  const props = {display, activate}
  return <Key 
    default={props}
    shift={props}
    alphaMega={props}
    alphaMicron={props}
    trig={props}
    disabled={disabled}
  />
}

const detectDisplayHint = (display: MathSymbols) =>
  React.isValidElement(display) ? 'functional' : (
    display.toString().length > 4 ? 'verbose' : undefined
  )

const createMode = (type: ModeType) =>
  (display: MathSymbols, isFunctional: boolean = false, outputOverride?: MathSymbols): ModeProps =>
    ({
      type, 
      display, 
      displayHint: detectDisplayHint(display), 
      activate: createKeyPress((outputOverride ?? display) + (isFunctional ? '(' : ''))
    })

export const main = createMode('default'),
  shift = createMode('shift'),
  alphaMega = createMode('alphaMega'),
  alphaMicron = createMode('alphaMicron'),
  trig = createMode('trig');
