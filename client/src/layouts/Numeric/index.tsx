import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { 
  createKey, main, shift, alphaMega, alphaMicron, trig
} from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';

export interface NumericProps {

}

export const Numeric = (props: NumericProps) => {
  return (
    // <KeyGroup layout='rectangular' columns={3}>
    <>
      {createKey(
        main('7'),
        alphaMega('P'),
        alphaMicron('p'),
        trig('csc', true)
      )}
      {createKey(
        main('8'),
        alphaMega('Q'),
        alphaMicron('q'),
        trig('csch', true)
      )}
      {createKey(
        main('9'),
        alphaMega('R'),
        alphaMicron('r'),
        trig('acsc', true)
      )}
      {createKey(
        main('4'),
        alphaMega('T'),
        alphaMicron('t'),
        trig('sec', true)
      )}
      {createKey(
        main('5'),
        alphaMega('U'),
        alphaMicron('u'),
        trig('sech', true)
      )}
      {createKey(
        main('6'),
        alphaMega('V'),
        alphaMicron('v'),
        trig('asec', true)
      )}
      {createKey(
        main('1'),
        shift(Unicode.i),
        alphaMega('X'),
        alphaMicron('x'),
        trig('cot', true)
      )}
      {createKey(
        main('2'),
        shift(Unicode.e),
        alphaMega('Y'),
        alphaMicron('y'),
        trig('coth', true)
      )}
      {createKey(
        main('3'),
        shift(Unicode.pi),
        alphaMega('Z'),
        alphaMicron('z'),
        trig('acot', true)
      )}
      {createKey(
        main('0'),
        shift(Unicode.infinity),
        alphaMega(Unicode.space, false, ' '),
        alphaMicron(Unicode.space, false, ' ')
      )}
      {createKey(
        main('.'),
        shift(Unicode.euler),
        alphaMega(':'),
        alphaMicron(':')
      )}
      {createKey(
        main('<-'),
        shift('nil'),
        alphaMega('<-'),
        alphaMicron('<-')
      )}
    </>
    // </KeyGroup>
  )
}