import React from 'react';
import { commandKey } from '../../features/Key';
import { createToggleKey } from '../../features/ToggleKey';
import { Unicode } from '../../common/MathSymbols';
import { calculate, deleteLast } from '../../features/Terminal/Terminal.slice';
import { useAppSelector } from '../../app/hooks';

export interface ControlProps {

}

export const Control = (props: ControlProps) => {
  const currentMode = useAppSelector(state => state.keypad.currentMode)
  const currentLine = useAppSelector(state => state.terminal.currentLine)
  return (
    <>
      {createToggleKey('trig', Unicode.angle, 'trig', currentMode)}
      {createToggleKey('logic', Unicode.logic, 'logic', currentMode)}
      {createToggleKey('alt', Unicode.alt, 'alt', currentMode)}
      {createToggleKey('shift', Unicode.shift, 'shift', currentMode)}
      {createToggleKey('constant', '', 'constant', currentMode)}
      {createToggleKey('alphaMega', Unicode.alphaMega, 'alphaMega', currentMode)}
      {createToggleKey('alphaMinor', Unicode.alphaMicron, 'alphaMicron', currentMode)}
      {commandKey('execute', 'EXE', currentLine.length === 0, (dispatch) => dispatch(calculate()))}
      {commandKey('delete', 'DEL', currentLine.length === 0, (dispatch) => dispatch(deleteLast()))}
    </>
  )
}