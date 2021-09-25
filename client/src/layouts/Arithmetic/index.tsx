import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key, createKeyPress } from '../../features/Key';
import { Unicode, functional } from '../../common/MathSymbols';

export interface ArithmeticProps {

}

export const Arithmetic = (props: ArithmeticProps) => (
  <KeyGroup layout='vertical'>
    <Key 
      default={{type: 'default', display: Unicode.division, displayHint: 'icon', activate: createKeyPress('/')}}
      shift={{type: 'shift', display: functional.invert, displayHint: 'functional'}}
      alpha={{type: 'alpha', display: 'M'}}
    />
    <Key 
      default={{type: 'default', display: Unicode.multiplication, displayHint: 'icon', activate: createKeyPress('*')}}
      shift={{type: 'shift', display: 'EE'}}
      alpha={{type: 'alpha', display: 'R'}}
    />
    <Key 
      default={{type: 'default', display: Unicode.minus, displayHint: 'icon', activate: createKeyPress('-')}}
      shift={{type: 'shift', display: ''}}
      alpha={{type: 'alpha', display: 'W'}}
    />
    <Key 
      default={{type: 'default', display: '+', displayHint: 'icon', activate: createKeyPress('+')}}
      alpha={{type: 'alpha', display: '#'}}
    />
  </KeyGroup>
);