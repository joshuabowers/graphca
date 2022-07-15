import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { 
  createKey, main, shift, alphaMega, alphaMicron, trig,
  constant, alt, logic
} from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';

export interface NumericProps {

}

export const Numeric = (props: NumericProps) => {
  return (
    // <KeyGroup layout='rectangular' columns={3}>
    <>
      {createKey(
        'seven',
        main('7'),
        alphaMega('P'),
        alphaMicron('p'),
        trig('csc', true)
      )}
      {createKey(
        'eight',
        main('8'),
        alphaMega('Q'),
        alphaMicron('q'),
        trig('csch', true)
      )}
      {createKey(
        'nine',
        main('9'),
        alphaMega('R'),
        alphaMicron('r'),
        trig('acsc', true)
      )}
      {createKey(
        'four',
        main('4'),
        alphaMega('T'),
        alphaMicron('t'),
        trig('sec', true)
      )}
      {createKey(
        'five',
        main('5'),
        alphaMega('U'),
        alphaMicron('u'),
        trig('sech', true)
      )}
      {createKey(
        'six',
        main('6'),
        alphaMega('V'),
        alphaMicron('v'),
        trig('asec', true)
      )}
      {createKey(
        'one',
        main('1'),
        constant(Unicode.i),
        alphaMega('X'),
        alphaMicron('x'),
        trig('cot', true)
      )}
      {createKey(
        'two',
        main('2'),
        constant(Unicode.e),
        alphaMega('Y'),
        alphaMicron('y'),
        trig('coth', true)
      )}
      {createKey(
        'three',
        main('3'),
        constant(Unicode.pi),
        alphaMega('Z'),
        alphaMicron('z'),
        trig('acot', true)
      )}
      {createKey(
        'zero',
        main('0'),
        constant(Unicode.infinity),
        alphaMega(Unicode.space, false, ' '),
        alphaMicron(Unicode.space, false, ' ')
      )}
      {createKey(
        'decimal',
        main('.'),
        constant(Unicode.euler),
        alphaMega(':'),
        alphaMicron(':')
      )}
      {createKey(
        'assign',
        main('<-'),
        constant('nil'),
        alphaMega('<-'),
        alphaMicron('<-')
      )}
    </>
    // </KeyGroup>
  )
}