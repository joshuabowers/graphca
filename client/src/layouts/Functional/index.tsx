import React from 'react';
import {
  createKey, main, shift, alphaMega, alphaMicron, trig,
  alt, logic, constant
} from '../../features/Key';
import { Unicode, functional } from '../../common/MathSymbols';

export interface FunctionalProps {

}

export const Functional = (args: FunctionalProps) => {
  return (
    <>
      {createKey(
        'var',
        main(functional.variables, false, 'x'),
        alphaMega('A'),
        alphaMicron('a'),
        trig(Unicode.theta)
      )}
      {createKey(
        'diff',
        main(Unicode.derivative, true),
        shift(Unicode.integral, true),
        alphaMega('B'),
        alphaMicron('b'),
      )}
      {createKey(
        'ans',
        main('Ans'),
        alphaMega('C'),
        alphaMicron('c')
      )}
      {createKey(
        'fact',
        main('!'),
        shift(Unicode.gamma, true),
        alt(Unicode.digamma, true),
        alphaMega('G'),
        alphaMicron('g'),
        trig('asinh', true)
      )}
      {createKey(
        'abs',
        main('abs', true),
        alphaMega('D'),
        alphaMicron('d'),
        trig('sin', true)
      )}
      {createKey(
        '',
        alphaMega('E'),
        alphaMicron('e'),
        trig('asin', true)
      )}
      {createKey(
        'comb',
        main('nPr', true, 'P'),
        shift('nCr', true, 'C'),
        alphaMega('F'),
        alphaMicron('f'),
        trig('sinh', true)
      )}
      {createKey(
        'comma',
        main(','),
        alphaMega('H'),
        alphaMicron('h'),
        trig('cos', true)
      )}
      {createKey(
        'open',
        main('('),
        shift('{'),
        alt('['),
        alphaMega('I'),
        alphaMicron('i'),
        trig('acos', true)
      )}
      {createKey(
        'close',
        main(')'),
        shift('}'),
        alt(']'),
        alphaMega('J'),
        alphaMicron('j'),
        trig('cosh', true)
      )}
      {createKey(
        'lb',
        main('lb', true),
        alphaMega('L'),
        alphaMicron('l'),
        trig('tan', true)
      )}
      {createKey(
        'ln',
        main('ln', true),
        shift('log', true),
        alphaMega('M'),
        alphaMicron('m'),
        trig('atan', true)
      )}
      {createKey(
        'lg',
        main('lg', true),
        alphaMega('N'),
        alphaMicron('n'),
        trig('tanh', true)
      )}
    </>
  )
}
