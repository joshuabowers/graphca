import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { 
  commandKey,
  createKey, main, shift, alphaMega, alphaMicron, trig 
} from '../../features/Key';
import { functional, Unicode } from '../../common/MathSymbols';
import { useAppSelector } from '../../app/hooks';
import { deleteLast } from '../../features/Terminal/Terminal.slice';

export interface ArithmeticProps {

}

export const Arithmetic = (props: ArithmeticProps) => {
  const currentLine = useAppSelector(state => state.terminal.currentLine);

  return (
    <KeyGroup layout='vertical'>
      {commandKey('DEL', currentLine.length === 0, (dispatch) => dispatch(deleteLast()))}
      {createKey(
        main(Unicode.gamma, true),
        shift(Unicode.digamma, true),
        alphaMega('E'),
        alphaMicron('e'),
        trig('asinh', true)
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
        alphaMega('_'),
        alphaMicron('_'),
        trig('acoth', true)
      )}
      {createKey(
        main('+'),
        alphaMega('#'),
        alphaMicron('#')
      )}
    </KeyGroup>
  );
} 