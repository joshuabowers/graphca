import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { 
  createKey, main, shift, alphaMega, alphaMicron, trig 
} from '../../features/Key';
import { Unicode, functional } from '../../common/MathSymbols';

export interface FunctionalProps {

}

export const Functional = (args: FunctionalProps) => (
  <KeyGroup layout='rectangular' columns={5} fullWidth>
    {createKey(
      main(functional.variables, false, 'x'),
      alphaMega('A'),
      alphaMicron('a')
    )}
    {createKey(
      main(Unicode.derivative, true),
      shift(Unicode.integral, true),
      alphaMega('B'),
      alphaMicron('b'),
      trig('sin', true)
    )}
    {createKey(
      main('nPr', true, 'P'),
      shift('nCr', true, 'C'),
      alphaMega('C'),
      alphaMicron('c'),
      trig('sinh', true)
    )}
    {createKey(
      main('!'),
      alphaMega('D'),
      alphaMicron('d'),
      trig('asin', true)
    )}
    {createKey(
      main(Unicode.gamma, true),
      shift(Unicode.digamma, true),
      alphaMega('E'),
      alphaMicron('e'),
      trig('asinh', true)
    )}
    {createKey(
      main('abs', true),
      alphaMega('F'),
      alphaMicron('f')
    )}
    {createKey(
      shift('['),
      alphaMega('G'),
      alphaMicron('g'),
      trig('cos', true)
    )}
    {createKey(
      main(','),
      shift(']'),
      alphaMega('H'),
      alphaMicron('h'),
      trig('cosh', true)
    )}
    {createKey(
      main('('),
      shift('{'),
      alphaMega('I'),
      alphaMicron('i'),
      trig('acos', true)
    )}
    {createKey(
      main(')'),
      shift('}'),
      alphaMega('J'),
      alphaMicron('j'),
      trig('acosh', true)
    )}
    {createKey(
      main('lb', true),
      alphaMega('K'),
      alphaMicron('k')
    )}
    {createKey(
      main('ln', true),
      shift('log'),
      alphaMega('L'),
      alphaMicron('l'),
      trig('tan', true)
    )}
    {createKey(
      main('lg', true),
      alphaMega('M'),
      alphaMicron('m'),
      trig('tanh', true)
    )}
    {createKey(
      main(functional.squared, false, '^2'),
      shift(Unicode.squareRoot, true),
      alphaMega('N'),
      alphaMicron('n'),
      trig('atan', true)
    )}
    {createKey(
      main(functional.xY, false, '^'),
      alphaMega('O'),
      alphaMicron('o'),
      trig('atanh', true)
    )}
  </KeyGroup>
)