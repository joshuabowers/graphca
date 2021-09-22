import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key } from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';

export interface NumericProps {

}

// Tuple structure: ['default', 'shift', 'alpha']
const numberKeys = [
  ['7', '', ''],
  ['8', '', ''],
  ['9', '', ''],
  ['4', '', ''],
  ['5', '', ''],
  ['6', '', ''],
  ['1', '', ''],
  ['2', '', ''],
  ['3', '', ''],
  ['0', '', Unicode.space],
  ['.', Unicode.i, ':'],
  [Unicode.plusMinus, 'Abs', '']
]

export const Numeric = (props: NumericProps) => {
  return (
    <KeyGroup layout='rectangular' columns={3}>
      {
        numberKeys.map((info) => (
          <Key 
            key={info[0]}
            default={{type: 'default', display: info[0]}}
            shift={{type: 'shift', display: info[1]}}
            alpha={{type: 'alpha', display: info[2]}}
          />  
        ))
      }
    </KeyGroup>
  )
}