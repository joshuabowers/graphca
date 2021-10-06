import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key } from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';
import { calculate, deleteLast } from '../../features/Terminal/Terminal.slice';

export interface ControlProps {

}

export const Control = (props: ControlProps) => (
  <KeyGroup layout='vertical'>
    <Key 
      default={{type: 'default', display: Unicode.delete, displayHint: 'icon', activate: (dispatch) => dispatch(deleteLast())}}
      shift={{type: 'shift', display: 'Ins'}}
    />
    <Key 
      default={{type: 'default', display: Unicode.shift, displayHint: 'icon'}}
      modeOverride='shift'
    />
    <Key 
      default={{type: 'default', display: Unicode.alpha}}
      shift={{type: 'shift', display: 'Lock'}}
      modeOverride='alpha'
    />
    <Key 
      default={{type: 'default', display: 'EXE', activate: (dispatch) => dispatch(calculate())}}
      shift={{type: 'shift', display: ''}}
      alpha={{type: 'alpha', display: ''}}
    />
  </KeyGroup>
)