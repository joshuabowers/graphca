import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key } from '../../features/Key';
import { ToggleKey } from '../../features/ToggleKey';
import { Unicode } from '../../common/MathSymbols';
import { calculate } from '../../features/Terminal/Terminal.slice';
import { changeMode } from '../Keypad/Keypad.slice';
import { useAppSelector } from '../../app/hooks';

export interface ControlProps {

}

export const Control = (props: ControlProps) => {
  const currentMode = useAppSelector(state => state.keypad.currentMode)
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
      <Key 
        default={{type: 'default', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
        shift={{type: 'shift', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
        alphaMega={{type: 'alphaMega', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
        alphaMicron={{type: 'alphaMicron', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
        trig={{type: 'trig', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
      />
    </KeyGroup>
  )
}