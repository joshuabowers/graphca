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
        trig('sin', true)
      )}
      {createKey(
        'ans',
        main('ANS'),
        alphaMega('G'),
        alphaMicron('g'),
        trig('cos', true)
      )}
      {createKey(
        'fact',
        main('!'),
        shift(Unicode.gamma, true),
        alt(Unicode.digamma, true),
        alphaMega('D'),
        alphaMicron('d'),
        trig('asin', true)
      )}
      {createKey(
        'abs',
        main('abs', true),
        alphaMega('F'),
        alphaMicron('f')
      )}
      {createKey(
        '',
        alphaMega('E'),
        alphaMicron('e'),
        trig('asinh', true)
      )}
      {createKey(
        'comb',
        main('nPr', true, 'P'),
        shift('nCr', true, 'C'),
        alphaMega('C'),
        alphaMicron('c'),
        trig('sinh', true)
      )}
      {createKey(
        'comma',
        main(','),
        alphaMega('H'),
        alphaMicron('h'),
        trig('cosh', true)
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
        trig('acosh', true)
      )}
      {createKey(
        'lb',
        main('lb', true),
        alphaMega('K'),
        alphaMicron('k')
      )}
      {createKey(
        'ln',
        main('ln', true),
        shift('log', true),
        alphaMega('L'),
        alphaMicron('l'),
        trig('tan', true)
      )}
      {createKey(
        'lg',
        main('lg', true),
        alphaMega('M'),
        alphaMicron('m'),
        trig('tanh', true)
      )}
    </>
  )
}
