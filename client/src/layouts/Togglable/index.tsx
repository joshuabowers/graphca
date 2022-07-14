import React from 'react';

import { Unicode } from '../../common/MathSymbols';
import { Key, commandKey } from '../../features/Key'
import { ToggleKey } from '../../features/ToggleKey';
import { KeyGroup } from '../../features/KeyGroup';
import { useAppSelector } from '../../app/hooks';
import { deleteLast } from '../../features/Terminal/Terminal.slice';
import { changeMode } from '../Keypad/Keypad.slice';

export interface TogglableProps {

}

export const Togglable = (props: TogglableProps) => {
  const currentMode = useAppSelector(state => state.keypad.currentMode);
  const currentLine = useAppSelector(state => state.terminal.currentLine);
  return (
    <KeyGroup layout='horizontal' fullWidth>
      <ToggleKey 
        default={{
          type: 'default', 
          display: Unicode.angle, 
          activate: (dispatch) => dispatch(changeMode(currentMode === 'trig' ? 'default' : 'trig'))
        }}
        toggled={currentMode === 'trig'}
      />
      <Key 
        default={{type: 'default', display: ''}}
      />
      <Key 
        default={{type: 'default', display: ''}}
      />
      <Key 
        default={{type: 'default', display: ''}}
      />
      {commandKey('DEL', currentLine.length === 0, (dispatch) => dispatch(deleteLast()))}
    </KeyGroup>
  )
}