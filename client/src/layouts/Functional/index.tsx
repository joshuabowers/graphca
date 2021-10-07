import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key, createKeyPress } from '../../features/Key';
import { Unicode, functional } from '../../common/MathSymbols';

export interface FunctionalProps {

}

export const Functional = (args: FunctionalProps) => (
  <KeyGroup layout='rectangular' columns={5} fullWidth>
    <Key
      default={{type:'default', display:functional.variables, activate: createKeyPress('x')}}
      shift={{type:'shift', display:Unicode.pi, activate: createKeyPress(Unicode.pi)}}
      alpha={{type:'alpha', display:'A', activate: createKeyPress('A')}}
    />
    <Key
      default={{type:'default', display:functional.partialDerivative}}
      shift={{type:'shift', display:Unicode.integral}}
      alpha={{type:'alpha', display:'B', activate: createKeyPress('B')}}
    />
    <Key
      default={{type:'default', display:'nPr'}}
      shift={{type:'shift', display:'nCr'}}
      alpha={{type:'alpha', display:'C', activate: createKeyPress('C')}}
    />
    <Key
      default={{type:'default', display:'!', activate: createKeyPress('!')}}
      shift={{type:'shift', display:'['}}
      alpha={{type:'alpha', display:'D', activate: createKeyPress('D')}}
    />
    <Key
      default={{type:'default', display:',', activate: createKeyPress(',')}}
      shift={{type:'shift', display:']'}}
      alpha={{type:'alpha', display:'E', activate: createKeyPress('E')}}
    />
    <Key
      default={{type:'default', display:'sin', activate: createKeyPress('sin(')}}
      shift={{type:'shift', display:'asin', activate: createKeyPress('asin(')}}
      alpha={{type:'alpha', display:'F', activate: createKeyPress('F')}}
    />
    <Key
      default={{type:'default', display:'cos', activate: createKeyPress('cos(')}}
      shift={{type:'shift', display:'acos', activate: createKeyPress('acos(')}}
      alpha={{type:'alpha', display:'G', activate: createKeyPress('G')}}
    />
    <Key
      default={{type:'default', display:'tan', activate: createKeyPress('tan(')}}
      shift={{type:'shift', display:'atan', activate: createKeyPress('atan(')}}
      alpha={{type:'alpha', display:'H', activate: createKeyPress('H')}}
    />
    <Key
      default={{type:'default', display:'(', activate: createKeyPress('(')}}
      shift={{type:'shift', display:'{'}}
      alpha={{type:'alpha', display:'I', activate: createKeyPress('I')}}
    />
    <Key
      default={{type:'default', display:')', activate: createKeyPress(')')}}
      shift={{type:'shift', display:'}'}}
      alpha={{type:'alpha', display:'J', activate: createKeyPress('J')}}
    />
    <Key
      default={{type:'default', display:'lg', activate: createKeyPress('lg(')}}
      shift={{type:'shift', display:functional.base2, displayHint:'functional'}}
      alpha={{type:'alpha', display:'K', activate: createKeyPress('K')}}
    />
    <Key
      default={{type:'default', display:'ln', activate: createKeyPress('ln(')}}
      shift={{type:'shift', display:functional.eX, displayHint:'functional'}}
      alpha={{type:'alpha', display:'L', activate: createKeyPress('L')}}
    />
    <Key
      default={{type:'default', display:'log', activate: createKeyPress('log(')}}
      shift={{type:'shift', display:functional.base10, displayHint:'functional'}}
      alpha={{type:'alpha', display:'M', activate: createKeyPress('M')}}
    />
    <Key
      default={{type:'default', display:functional.squared, displayHint:'functional', activate: createKeyPress('^2')}}
      shift={{type:'shift', display:Unicode.squareRoot}}
      alpha={{type:'alpha', display:'N', activate: createKeyPress('N')}}
    />
    <Key
      default={{type:'default', display:functional.xY, displayHint:'functional', activate: createKeyPress('^')}}
      shift={{type:'shift', display:functional.nRoot, displayHint:'functional'}}
      alpha={{type:'alpha', display:'O', activate: createKeyPress('O')}}
    />
  </KeyGroup>
)