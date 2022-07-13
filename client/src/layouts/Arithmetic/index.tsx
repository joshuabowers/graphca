import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { 
  createKey, main, shift, alphaMega, alphaMicron, trig 
} from '../../features/Key';
import { functional } from '../../common/MathSymbols';

export interface ArithmeticProps {

}

export const Arithmetic = (props: ArithmeticProps) => (
  <KeyGroup layout='vertical'>
    {createKey(
      main('/'),
      shift(functional.invert, false, '^-1'),
      alphaMega('S'),
      alphaMicron('s'),
      trig('acsch', true)
    )}
    {createKey(
      main('*'), // Possibly change back to Unicode.multiplication
      shift('EE', false, 'E'),
      alphaMega('W'),
      alphaMicron('w'),
      trig('asech', true)
    )}
    {createKey(
      main('-'),
      trig('acoth', true)
    )}
    {createKey(
      main('+'),
      alphaMega('#'),
      alphaMicron('#')
    )}
  </KeyGroup>
);