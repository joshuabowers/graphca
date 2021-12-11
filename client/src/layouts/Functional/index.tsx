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
      alphaMega={{type:'alphaMega', display:'A', activate: createKeyPress('A')}}
      alphaMicron={{type: 'alphaMicron', display: 'a', activate: createKeyPress('a')}}
      trig={{type:'trig', display:''}}
    />
    <Key
      default={{type:'default', display:Unicode.derivative, activate: createKeyPress(`${Unicode.derivative}(`)}}
      shift={{type:'shift', display:Unicode.integral}}
      alphaMega={{type:'alphaMega', display:'B', activate: createKeyPress('B')}}
      alphaMicron={{type: 'alphaMicron', display: 'b', activate: createKeyPress('b')}}
      trig={{type:'trig', display:'sin', activate: createKeyPress('sin(')}}
    />
    <Key
      default={{type:'default', display:'nPr', activate: createKeyPress('P(')}}
      shift={{type:'shift', display:'nCr', activate: createKeyPress('C(')}}
      alphaMega={{type:'alphaMega', display:'C', activate: createKeyPress('C')}}
      alphaMicron={{type: 'alphaMicron', display: 'c', activate: createKeyPress('c')}}
      trig={{type:'trig', display:'sinh', activate: createKeyPress('sinh(')}}
    />
    <Key
      default={{type:'default', display:'!', activate: createKeyPress('!')}}
      shift={{type:'shift', display:''}}
      alphaMega={{type:'alphaMega', display:'D', activate: createKeyPress('D')}}
      alphaMicron={{type: 'alphaMicron', display: 'd', activate: createKeyPress('d')}}
      trig={{type:'trig', display:'asin', activate: createKeyPress('asin(')}}
    />
    <Key
      default={{type:'default', display:Unicode.gamma, activate: createKeyPress(`${Unicode.gamma}(`)}}
      shift={{type:'shift', display:Unicode.digamma, activate: createKeyPress(`${Unicode.digamma}(`)}}
      alphaMega={{type:'alphaMega', display:'E', activate: createKeyPress('E')}}
      alphaMicron={{type: 'alphaMicron', display: 'e', activate: createKeyPress('e')}}
      trig={{type:'trig', display:'asinh', displayHint:'verbose', activate: createKeyPress('asinh(')}}
    />
    <Key
      default={{type:'default', display:'abs', activate: createKeyPress('abs(')}}
      shift={{type:'shift', display:''}}
      alphaMega={{type:'alphaMega', display:'F', activate: createKeyPress('F')}}
      alphaMicron={{type: 'alphaMicron', display: 'f', activate: createKeyPress('f')}}
      trig={{type:'trig', display:''}}
    />
    <Key
      default={{type:'default', display:''}}
      shift={{type:'shift', display:'[', activate: createKeyPress('[')}}
      alphaMega={{type:'alphaMega', display:'G', activate: createKeyPress('G')}}
      alphaMicron={{type: 'alphaMicron', display: 'g', activate: createKeyPress('g')}}
      trig={{type:'trig', display:'cos', activate: createKeyPress('cos(')}}
    />
    <Key
      default={{type:'default', display:',', activate: createKeyPress(',')}}
      shift={{type:'shift', display:']', activate: createKeyPress(']')}}
      alphaMega={{type:'alphaMega', display:'H', activate: createKeyPress('H')}}
      alphaMicron={{type: 'alphaMicron', display: 'h', activate: createKeyPress('h')}}
      trig={{type:'trig', display:'cosh', activate: createKeyPress('cosh(')}}
    />
    <Key
      default={{type:'default', display:'(', activate: createKeyPress('(')}}
      shift={{type:'shift', display:'{', activate: createKeyPress('{')}}
      alphaMega={{type:'alphaMega', display:'I', activate: createKeyPress('I')}}
      alphaMicron={{type: 'alphaMicron', display: 'i', activate: createKeyPress('i')}}
      trig={{type:'trig', display:'acos', activate: createKeyPress('acos(')}}
    />
    <Key
      default={{type:'default', display:')', activate: createKeyPress(')')}}
      shift={{type:'shift', display:'}', activate: createKeyPress('}')}}
      alphaMega={{type:'alphaMega', display:'J', activate: createKeyPress('J')}}
      alphaMicron={{type: 'alphaMicron', display: 'j', activate: createKeyPress('j')}}
      trig={{type:'trig', display:'acosh', displayHint:'verbose', activate: createKeyPress('acosh(')}}
      
    />
    <Key
      default={{type:'default', display:'lb', activate: createKeyPress('lb(')}}
      shift={{type:'shift', display:''}}
      alphaMega={{type:'alphaMega', display:'K', activate: createKeyPress('K')}}
      alphaMicron={{type: 'alphaMicron', display: 'k', activate: createKeyPress('k')}}
      trig={{type:'trig', display:''}}
    />
    <Key
      default={{type:'default', display:'ln', activate: createKeyPress('ln(')}}
      shift={{type:'shift', display:''}}
      alphaMega={{type:'alphaMega', display:'L', activate: createKeyPress('L')}}
      alphaMicron={{type: 'alphaMicron', display: 'l', activate: createKeyPress('l')}}
      trig={{type:'trig', display:'tan', activate: createKeyPress('tan(')}}
    />
    <Key
      default={{type:'default', display:'lg', activate: createKeyPress('lg(')}}
      shift={{type:'shift', display:''}}
      alphaMega={{type:'alphaMega', display:'M', activate: createKeyPress('M')}}
      alphaMicron={{type: 'alphaMicron', display: 'm', activate: createKeyPress('m')}}
      trig={{type:'trig', display:'tanh', activate: createKeyPress('tanh(')}}
    />
    <Key
      default={{type:'default', display:functional.squared, displayHint:'functional', activate: createKeyPress('^2')}}
      shift={{type:'shift', display:Unicode.squareRoot, activate: createKeyPress(`${Unicode.squareRoot}(`)}}
      alphaMega={{type:'alphaMega', display:'N', activate: createKeyPress('N')}}
      alphaMicron={{type: 'alphaMicron', display: 'n', activate: createKeyPress('n')}}
      trig={{type:'trig', display:'atan', activate: createKeyPress('atan(')}}
    />
    <Key
      default={{type:'default', display:functional.xY, displayHint:'functional', activate: createKeyPress('^')}}
      shift={{type:'shift', display:''}}
      alphaMega={{type:'alphaMega', display:'O', activate: createKeyPress('O')}}
      alphaMicron={{type: 'alphaMicron', display: 'o', activate: createKeyPress('o')}}
      trig={{type:'trig', display:'atanh', displayHint:'verbose', activate: createKeyPress('atanh(')}}
    />
  </KeyGroup>
)