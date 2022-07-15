import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { commandKey } from '../../features/Key';
import { createToggleKey } from '../../features/ToggleKey';
import { Unicode } from '../../common/MathSymbols';
import { calculate } from '../../features/Terminal/Terminal.slice';
import { useAppSelector } from '../../app/hooks';

export interface ControlProps {

}

export const Control = (props: ControlProps) => {
  const currentMode = useAppSelector(state => state.keypad.currentMode)
  const currentLine = useAppSelector(state => state.terminal.currentLine)
  return (
    // <KeyGroup layout='vertical'>
    <>
      {createToggleKey('trig', Unicode.angle, 'trig', currentMode)}
      {createToggleKey('logic', '', 'default', currentMode)}
      {createToggleKey('alt', '', 'default', currentMode)}
      {createToggleKey('shift', Unicode.shift, 'shift', currentMode)}
      {createToggleKey('constant', '', 'default', currentMode)}
      {createToggleKey('alphaMega', Unicode.alphaMega, 'alphaMega', currentMode)}
      {createToggleKey('alphaMinor', Unicode.alphaMicron, 'alphaMicron', currentMode)}
      {commandKey('execute', 'EXE', currentLine.length === 0, (dispatch) => dispatch(calculate()))}
    </>
    // </KeyGroup>
  )
}