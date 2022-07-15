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
    <KeyGroup layout='vertical'>
      {createToggleKey(Unicode.angle, 'trig', currentMode)}
      {createToggleKey('', 'default', currentMode)}
      {createToggleKey('', 'default', currentMode)}
      {createToggleKey('', 'default', currentMode)}
      {createToggleKey(Unicode.shift, 'shift', currentMode)}
      {createToggleKey(Unicode.alphaMega, 'alphaMega', currentMode)}
      {createToggleKey(Unicode.alphaMicron, 'alphaMicron', currentMode)}
      {commandKey('EXE', currentLine.length === 0, (dispatch) => dispatch(calculate()))}
    </KeyGroup>
  )
}