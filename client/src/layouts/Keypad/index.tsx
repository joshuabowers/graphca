import React from 'react';
import styles from './Keypad.module.css'

import { Arithmetic } from '../Arithmetic';
import { Numeric } from '../Numeric';
import { Control } from '../Control';

export interface KeypadProps {

}

export const Keypad = (props: KeypadProps) => {
  return (
    <div className={styles.keypad}>
      <Arithmetic />
      <Numeric />
      <Control />
    </div>
  );
}