import React from 'react';
import { 
  createKey, main, shift, alphaMega, alphaMicron, trig 
} from '../../features/Key';
import { functional, Unicode } from '../../common/MathSymbols';

export interface ArithmeticProps {

}

export const Arithmetic = (props: ArithmeticProps) => {
  return (
    <>
      {createKey(
        'square',
        main(functional.squared, false, '^2'),
        shift(Unicode.squareRoot, true),
        alphaMega('K'),
        alphaMicron('k'),
        trig('acosh', true)
      )}
      {createKey(
        'raise',
        main(functional.xY, false, '^'),
        alphaMega('O'),
        alphaMicron('o'),
        trig('atanh', true)
      )}
      {createKey(
        'divide',
        main('/'),
        shift(functional.invert, false, '^-1'),
        alphaMega('S'),
        alphaMicron('s'),
        trig('acsch', true)
      )}
      {createKey(
        'multiply',
        main('*'), // Possibly change back to Unicode.multiplication
        shift('EE', false, 'E'),
        alphaMega('W'),
        alphaMicron('w'),
        trig('asech', true)
      )}
      {createKey(
        'subtract',
        main('-'),
        alphaMega('_'),
        alphaMicron('_'),
        trig('acoth', true)
      )}
      {createKey(
        'add',
        main('+'),
        alphaMega('#'),
        alphaMicron('#')
      )}
    </>
  );
} 