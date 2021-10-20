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
      shift={{type: 'shift', display: functional.invert, displayHint: 'functional', activate: createKeyPress('^-1')}}
      alpha={{type: 'alpha', display: 'S', activate: createKeyPress('S')}}
      trig={{type:'trig', display:''}}
    />
    <Key 
      default={{type: 'default', display: Unicode.multiplication, displayHint: 'icon', activate: createKeyPress('*')}}
      shift={{type: 'shift', display: 'EE', activate: createKeyPress('E')}}
      alpha={{type: 'alpha', display: 'W', activate: createKeyPress('W')}}
      trig={{type:'trig', display:''}}
    />
    <Key 
      default={{type: 'default', display: Unicode.minus, displayHint: 'icon', activate: createKeyPress('-')}}
      shift={{type: 'shift', display: ''}}
      alpha={{type: 'alpha', display: ''}}
      trig={{type:'trig', display:''}}
    />
    <Key 
      default={{type: 'default', display: '+', displayHint: 'icon', activate: createKeyPress('+')}}
      shift={{type: 'shift', display: ''}}
      alpha={{type: 'alpha', display: '#', activate: createKeyPress('#')}}
      trig={{type:'trig', display:''}}
    />
  </KeyGroup>
);