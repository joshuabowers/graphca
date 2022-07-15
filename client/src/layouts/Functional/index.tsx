import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { 
  Key, commandKey,
  createKey, main, shift, alphaMega, alphaMicron, trig 
} from '../../features/Key';
import { Unicode, functional } from '../../common/MathSymbols';
import { useAppSelector } from '../../app/hooks';
import { deleteLast } from '../../features/Terminal/Terminal.slice';

export interface FunctionalProps {

}

export const Functional = (args: FunctionalProps) => {
  const currentLine = useAppSelector(state => state.terminal.currentLine);

  return (
    // <KeyGroup layout='rectangular' columns={3}>
    <>
      {createKey(
        'var',
        main(functional.variables, false, 'x'),
        alphaMega('A'),
        alphaMicron('a')
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
        'comb',
        main('nPr', true, 'P'),
        shift('nCr', true, 'C'),
        alphaMega('C'),
        alphaMicron('c'),
        trig('sinh', true)
      )}
      {createKey(
        'fact',
        main('!'),
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
        shift('['),
        alphaMega('G'),
        alphaMicron('g'),
        trig('cos', true)
      )}
      {createKey(
        'comma',
        main(','),
        shift(']'),
        alphaMega('H'),
        alphaMicron('h'),
        trig('cosh', true)
      )}
      {createKey(
        'open',
        main('('),
        shift('{'),
        alphaMega('I'),
        alphaMicron('i'),
        trig('acos', true)
      )}
      {createKey(
        'close',
        main(')'),
        shift('}'),
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
        shift('log'),
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
    // </KeyGroup>
  )
}
