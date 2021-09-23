import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key } from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';

export interface ControlProps {

}

export const Control = (props: ControlProps) => (
  <KeyGroup layout='vertical'>
    <Key 
      default={{type: 'default', display: Unicode.delete, displayHint: 'icon'}}
      shift={{type: 'shift', display: 'Ins'}}
    />
    <Key 
      default={{type: 'default', display: Unicode.shift, displayHint: 'icon'}}
      modeOverride='shift'
    />
    <Key 
      default={{type: 'default', display: 'Alpha'}}
      shift={{type: 'shift', display: 'Lock'}}
      modeOverride='alpha'
    />
    <Key 
      default={{type: 'default', display: 'EXE'}}
      shift={{type: 'shift', display: ''}}
      alpha={{type: 'alpha', display: ''}}
    />
  </KeyGroup>
)