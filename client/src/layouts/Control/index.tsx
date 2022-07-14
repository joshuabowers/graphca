import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key, commandKey } from '../../features/Key';
import { ToggleKey } from '../../features/ToggleKey';
import { Unicode } from '../../common/MathSymbols';
import { calculate } from '../../features/Terminal/Terminal.slice';
import { changeMode } from '../Keypad/Keypad.slice';
import { useAppSelector } from '../../app/hooks';

export interface ControlProps {

}

export const Control = (props: ControlProps) => {
  const currentMode = useAppSelector(state => state.keypad.currentMode)
  const currentLine = useAppSelector(state => state.terminal.currentLine)
  return (
    <KeyGroup layout='vertical'>
      <ToggleKey 
        default={{
          type: 'default', 
          display: Unicode.shift, 
          activate: (dispatch) => dispatch(changeMode(currentMode === 'shift' ? 'default' : 'shift'))
        }}
        toggled={currentMode === 'shift'}
      />
      <ToggleKey
        default={{
          type: 'default',
          display: Unicode.alphaMega,
          activate: (dispatch) => dispatch(changeMode(currentMode === 'alphaMega' ? 'default' : 'alphaMega'))
        }}
        toggled={currentMode === 'alphaMega'}
      />
      <ToggleKey 
        default={{
          type: 'default', 
          display: Unicode.alphaMicron,
          activate: (dispatch) => dispatch(changeMode(currentMode === 'alphaMicron' ? 'default' : 'alphaMicron'))
        }}
        toggled={currentMode === 'alphaMicron'}
      />
      {commandKey('EXE', currentLine.length === 0, (dispatch) => dispatch(calculate()))}
    </KeyGroup>
  )
}