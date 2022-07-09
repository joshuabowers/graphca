import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key, createKeyPress } from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';

export interface NumericProps {

}

// Tuple structure: ['default', 'shift', 'alphaMega', 'alphaMicron', 'trig']
const numberKeys = [
  ['7', '', 'P', 'p', 'csc'],
  ['8', '', 'Q', 'q', 'csch'],
  ['9', '', 'R', 'r', 'acsc'],
  ['4', '', 'T', 't', 'sec'],
  ['5', '', 'U', 'u', 'sech'],
  ['6', '', 'V', 'v', 'asec'],
  ['1', Unicode.i, 'X', 'x', 'cot'],
  ['2', Unicode.e, 'Y', 'y', 'coth'],
  ['3', Unicode.pi, 'Z', 'z', 'acot'],
  ['0', Unicode.infinity, Unicode.space, Unicode.space, ''],
  ['.', Unicode.euler, ':', ':', ''],
  ['<-', 'nil', '<-', '<-', '']
]

const unicodeToASCII = new Map([[Unicode.space as string, ' ']])

export const Numeric = (props: NumericProps) => {
  return (
    <KeyGroup layout='rectangular' columns={3}>
      {
        numberKeys.map((info) => (
          <Key 
            key={info[0]}
            default={{type: 'default', display: info[0], activate: createKeyPress(info[0])}}
            shift={{type: 'shift', display: info[1], activate: info[1] ? createKeyPress(info[1]) : undefined}}
            alphaMega={{type: 'alphaMega', display: info[2], activate: createKeyPress(unicodeToASCII.get(info[2]) ?? info[2])}}
            alphaMicron={{type: 'alphaMicron', display: info[3], activate: createKeyPress(unicodeToASCII.get(info[3]) ?? info[3])}}
            trig={{type: 'trig', display: info[4], activate: info[4] ? createKeyPress(info[4]+'(') : undefined}}
          />  
        ))
      }
    </KeyGroup>
  )
}