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
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'A', activate: createKeyPress('A')}}
      trig={{type:'trig', display:''}}
    />
    <Key
      default={{type:'default', display:Unicode.derivative, activate: createKeyPress(`${Unicode.derivative}(`)}}
      shift={{type:'shift', display:Unicode.integral}}
      alpha={{type:'alpha', display:'B', activate: createKeyPress('B')}}
      trig={{type:'trig', display:'sin', activate: createKeyPress('sin(')}}
    />
    <Key
      default={{type:'default', display:'nPr', activate: createKeyPress('P(')}}
      shift={{type:'shift', display:'nCr', activate: createKeyPress('C(')}}
      alpha={{type:'alpha', display:'C', activate: createKeyPress('C')}}
      trig={{type:'trig', display:'sinh', activate: createKeyPress('sinh(')}}
    />
    <Key
      default={{type:'default', display:'!', activate: createKeyPress('!')}}
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'D', activate: createKeyPress('D')}}
      trig={{type:'trig', display:'asin', activate: createKeyPress('asin(')}}
    />
    <Key
      default={{type:'default', display:Unicode.gamma, activate: createKeyPress(`${Unicode.gamma}(`)}}
      shift={{type:'shift', display:Unicode.digamma, activate: createKeyPress(`${Unicode.digamma}(`)}}
      alpha={{type:'alpha', display:'E', activate: createKeyPress('E')}}
      trig={{type:'trig', display:'asinh', displayHint:'verbose', activate: createKeyPress('asinh(')}}
    />
    <Key
      default={{type:'default', display:'abs', activate: createKeyPress('abs(')}}
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'F', activate: createKeyPress('F')}}
      trig={{type:'trig', display:''}}
    />
    <Key
      default={{type:'default', display:''}}
      shift={{type:'shift', display:'[', activate: createKeyPress('[')}}
      alpha={{type:'alpha', display:'G', activate: createKeyPress('G')}}
      trig={{type:'trig', display:'cos', activate: createKeyPress('cos(')}}
    />
    <Key
      default={{type:'default', display:',', activate: createKeyPress(',')}}
      shift={{type:'shift', display:']', activate: createKeyPress(']')}}
      alpha={{type:'alpha', display:'H', activate: createKeyPress('H')}}
      trig={{type:'trig', display:'cosh', activate: createKeyPress('cosh(')}}
    />
    <Key
      default={{type:'default', display:'(', activate: createKeyPress('(')}}
      shift={{type:'shift', display:'{', activate: createKeyPress('{')}}
      alpha={{type:'alpha', display:'I', activate: createKeyPress('I')}}
      trig={{type:'trig', display:'acos', activate: createKeyPress('acos(')}}
    />
    <Key
      default={{type:'default', display:')', activate: createKeyPress(')')}}
      shift={{type:'shift', display:'}', activate: createKeyPress('}')}}
      alpha={{type:'alpha', display:'J', activate: createKeyPress('J')}}
      trig={{type:'trig', display:'acosh', displayHint:'verbose', activate: createKeyPress('acosh(')}}
      
    />
    <Key
      default={{type:'default', display:'lb', activate: createKeyPress('lb(')}}
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'K', activate: createKeyPress('K')}}
      trig={{type:'trig', display:''}}
    />
    <Key
      default={{type:'default', display:'ln', activate: createKeyPress('ln(')}}
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'L', activate: createKeyPress('L')}}
      trig={{type:'trig', display:'tan', activate: createKeyPress('tan(')}}
    />
    <Key
      default={{type:'default', display:'lg', activate: createKeyPress('lg(')}}
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'M', activate: createKeyPress('M')}}
      trig={{type:'trig', display:'tanh', activate: createKeyPress('tanh(')}}
    />
    <Key
      default={{type:'default', display:functional.squared, displayHint:'functional', activate: createKeyPress('^2')}}
      shift={{type:'shift', display:Unicode.squareRoot, activate: createKeyPress(`${Unicode.squareRoot}(`)}}
      alpha={{type:'alpha', display:'N', activate: createKeyPress('N')}}
      trig={{type:'trig', display:'atan', activate: createKeyPress('atan(')}}
    />
    <Key
      default={{type:'default', display:functional.xY, displayHint:'functional', activate: createKeyPress('^')}}
      shift={{type:'shift', display:''}}
      alpha={{type:'alpha', display:'O', activate: createKeyPress('O')}}
      trig={{type:'trig', display:'atanh', displayHint:'verbose', activate: createKeyPress('atanh(')}}
    />
  </KeyGroup>
)