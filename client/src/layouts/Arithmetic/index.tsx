import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key, createKeyPress } from '../../features/Key';
import { Unicode, functional } from '../../common/MathSymbols';

export interface ArithmeticProps {

}

export const Arithmetic = (props: ArithmeticProps) => (
  <KeyGroup layout='vertical'>
    <Key 
      default={{type: 'default', display: Unicode.division, displayHint: 'icon', activate: createKeyPress(Unicode.division)}}
      shift={{type: 'shift', display: functional.invert, displayHint: 'functional', activate: createKeyPress('^-1')}}
      alphaMega={{type: 'alphaMega', display: 'S', activate: createKeyPress('S')}}
      alphaMicron={{type: 'alphaMicron', display: 's', activate: createKeyPress('s')}}
      trig={{type:'trig', display:'acsch', displayHint: 'verbose', activate: createKeyPress('acsch(')}}
    />
    <Key 
      default={{type: 'default', display: Unicode.multiplication, displayHint: 'icon', activate: createKeyPress(Unicode.multiplication)}}
      shift={{type: 'shift', display: 'EE', activate: createKeyPress('E')}}
      alphaMega={{type: 'alphaMega', display: 'W', activate: createKeyPress('W')}}
      alphaMicron={{type: 'alphaMicron', display: 'w', activate: createKeyPress('w')}}
      trig={{type:'trig', display:'asech', displayHint: 'verbose', activate: createKeyPress('asech(')}}
    />
    <Key 
      default={{type: 'default', display: Unicode.minus, displayHint: 'icon', activate: createKeyPress(Unicode.minus)}}
      shift={{type: 'shift', display: ''}}
      alphaMega={{type: 'alphaMega', display: ''}}
      alphaMicron={{type: 'alphaMicron', display: ''}}
      trig={{type:'trig', display:'acoth', displayHint: 'verbose', activate: createKeyPress('acoth(')}}
    />
    <Key 
      default={{type: 'default', display: '+', displayHint: 'icon', activate: createKeyPress('+')}}
      shift={{type: 'shift', display: ''}}
      alphaMega={{type: 'alphaMega', display: '#', activate: createKeyPress('#')}}
      alphaMicron={{type: 'alphaMicron', display: '#', activate: createKeyPress('#')}}
      trig={{type:'trig', display:''}}
    />
  </KeyGroup>
);