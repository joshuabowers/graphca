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
      shift={{type:'shift', display:Unicode.pi}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:functional.partialDerivative}}
      shift={{type:'shift', display:Unicode.integral}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'nPr'}}
      shift={{type:'shift', display:'nCr'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'!', activate: createKeyPress('!')}}
      shift={{type:'shift', display:'['}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:',', activate: createKeyPress(',')}}
      shift={{type:'shift', display:']'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'sin', activate: createKeyPress('sin(')}}
      shift={{type:'shift', display:functional.asin, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'cos', activate: createKeyPress('cos(')}}
      shift={{type:'shift', display:functional.acos, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'tan', activate: createKeyPress('tan(')}}
      shift={{type:'shift', display:functional.atan, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'(', activate: createKeyPress('(')}}
      shift={{type:'shift', display:'{'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:')', activate: createKeyPress(')')}}
      shift={{type:'shift', display:'}'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'lg', activate: createKeyPress('lg(')}}
      shift={{type:'shift', display:functional.base2, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'ln', activate: createKeyPress('ln(')}}
      shift={{type:'shift', display:functional.eX, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:'log', activate: createKeyPress('log(')}}
      shift={{type:'shift', display:functional.base10, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:functional.squared, displayHint:'functional', activate: createKeyPress('^2')}}
      shift={{type:'shift', display:Unicode.squareRoot}}
      alpha={{type:'alpha', display:''}}
    />
    <Key
      default={{type:'default', display:functional.xY, displayHint:'functional', activate: createKeyPress('^')}}
      shift={{type:'shift', display:functional.nRoot, displayHint:'functional'}}
      alpha={{type:'alpha', display:''}}
    />
  </KeyGroup>
)