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
        trig(Unicode.theta),
        logic('==')
      )}
      {createKey(
        'diff',
        main(Unicode.derivative, true),
        shift(Unicode.integral, true),
        alphaMega('B'),
        alphaMicron('b'),
        logic('!=')
      )}
      {createKey(
        'ans',
        main('Ans'),
        alphaMega('C'),
        alphaMicron('c'),
        logic(Unicode.not)
      )}
      {createKey(
        'fact',
        main('!'),
        shift(Unicode.gamma, true),
        alt(Unicode.digamma, true),
        alphaMega('G'),
        alphaMicron('g'),
        trig('asinh', true),
        logic('>')
      )}
      {createKey(
        'abs',
        main('abs', true),
        alphaMega('D'),
        alphaMicron('d'),
        trig('sin', true),
        logic('<')
      )}
      {createKey(
        '',
        alphaMega('E'),
        alphaMicron('e'),
        trig('asin', true),
        logic('<=')
      )}
      {createKey(
        'comb',
        main('nPr', true, 'P'),
        shift('nCr', true, 'C'),
        alphaMega('F'),
        alphaMicron('f'),
        trig('sinh', true),
        logic('>=')
      )}
      {createKey(
        'comma',
        main(','),
        alphaMega('H'),
        alphaMicron('h'),
        trig('cos', true),
        logic('/\\', false, Unicode.and)
      )}
      {createKey(
        'open',
        main('('),
        shift('{'),
        alt('['),
        alphaMega('I'),
        alphaMicron('i'),
        trig('acos', true),
        logic('\\/', false, Unicode.or)
      )}
      {createKey(
        'close',
        main(')'),
        shift('}'),
        alt(']'),
        alphaMega('J'),
        alphaMicron('j'),
        trig('cosh', true),
        logic(Unicode.xor, false, undefined, true)
      )}
      {createKey(
        'lb',
        main('lb', true),
        alphaMega('L'),
        alphaMicron('l'),
        trig('tan', true),
        logic(Unicode.nand)
      )}
      {createKey(
        'ln',
        main('ln', true),
        shift('log', true),
        alphaMega('M'),
        alphaMicron('m'),
        trig('atan', true),
        logic(Unicode.nor)
      )}
      {createKey(
        'lg',
        main('lg', true),
        alphaMega('N'),
        alphaMicron('n'),
        trig('tanh', true),
        logic('<->', false, Unicode.xnor)
      )}
    </>
  )
}
