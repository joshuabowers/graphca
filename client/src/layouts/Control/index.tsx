import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key } from '../../features/Key';
import { ToggleKey } from '../../features/ToggleKey';
import { Unicode } from '../../common/MathSymbols';
import { calculate, deleteLast } from '../../features/Terminal/Terminal.slice';
import { changeMode } from '../Keypad/Keypad.slice';
import { useAppSelector } from '../../app/hooks';

export interface ControlProps {

}

export const Control = (props: ControlProps) => {
  const currentMode = useAppSelector(state => state.keypad.currentMode)
  return (
    <KeyGroup layout='vertical'>
      <Key 
        default={{type: 'default', display: Unicode.delete, displayHint: 'icon', activate: (dispatch) => dispatch(deleteLast())}}
        shift={{type: 'shift', display: 'Ins'}}
      />
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
          display: Unicode.alpha, 
          activate: (dispatch) => dispatch(changeMode(currentMode === 'alpha' ? 'default' : 'alpha'))
        }}
        shift={{type: 'shift', display: 'Lock'}}
        toggled={currentMode === 'alpha'}
      />
      <Key 
        default={{type: 'default', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
        shift={{type: 'shift', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
        alpha={{type: 'alpha', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
      />
    </KeyGroup>
  )
}