import React, { useEffect, useState } from 'react';
import { useAppDispatch, AppDispatch, useAppSelector } from '../../app/hooks';
import { keyPress } from '../Terminal/Terminal.slice';
import { Mode, ModeProps, ModeType } from '../Mode';
import { MathSymbols } from '../../common/MathSymbols';
import styles from './Key.module.css';

export interface KeyProps {
  modes: Map<ModeType, ModeProps>,
  modeOverride?: Exclude<ModeType, 'default'>,
  isCommand?: boolean
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
  const currentMode = props.modes.get(keyMode);
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

  const modeProps = currentMode 
    ?? (props.isCommand ? props.modes.get('default') : undefined) 
    ?? main('')

  return (
    <button 
      disabled={props.disabled ?? modeProps.display === ''}
      onClick={handler}
      className={appliedStyles.join(' ')}>
      <div className={styles.primary}>
        <Mode {...(modeProps)} />
      </div>
    </button>
  )
}

export const indexByType = (modes: ModeProps[]) =>
  new Map(modes.map(m => [m.type ?? 'default', m]))

export type ModeMap = ReturnType<typeof indexByType>;

const propsOrDisabled = (indexed: ModeMap, key: ModeType) =>
  indexed.get(key) ?? {type: key, display: ''}

export const createKey = (...modes: ModeProps[]) => {
  const indexed = indexByType(modes)
  return <Key 
    modes={indexed}
  />
}

export const commandKey = (display: MathSymbols, disabled: boolean, activate: (dispatch: AppDispatch) => void) => {
  const props: ModeProps = {type: 'default', display, activate}
  const modes = indexByType([props])
  return <Key 
    modes={modes}
    isCommand
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
