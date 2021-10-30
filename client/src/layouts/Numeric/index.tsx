import React from 'react';
import { KeyGroup } from '../../features/KeyGroup';
import { Key, createKeyPress } from '../../features/Key';
import { Unicode } from '../../common/MathSymbols';

export interface NumericProps {

}

// Tuple structure: ['default', 'shift', 'alpha', 'trig']
const numberKeys = [
  ['7', '', 'P', ''],
  ['8', '', 'Q', ''],
  ['9', '', 'R', ''],
  ['4', '', 'T', ''],
  ['5', '', 'U', ''],
  ['6', '', 'V', ''],
  ['1', Unicode.i, 'X', ''],
  ['2', Unicode.e, 'Y', ''],
  ['3', Unicode.pi, 'Z', ''],
  ['0', Unicode.infinity, Unicode.space, ''],
  ['.', Unicode.epsilon, ':', ''],
  ['<-', '', '', '']
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
            alpha={{type: 'alpha', display: info[2], activate: createKeyPress(unicodeToASCII.get(info[2]) ?? info[2])}}
            trig={{type: 'trig', display: info[3], activate: info[3] ? createKeyPress(info[3]) : undefined}}
          />  
        ))
      }
    </KeyGroup>
  )
}