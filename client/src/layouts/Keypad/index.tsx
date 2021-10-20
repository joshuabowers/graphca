import React from 'react';
import styles from './Keypad.module.css'

import { Arithmetic } from '../Arithmetic';
import { Numeric } from '../Numeric';
import { Control } from '../Control';
import { Functional } from '../Functional';
import { Togglable } from '../Togglable';

export interface KeypadProps {

}

export const Keypad = (props: KeypadProps) => {
  return (
    <div className={styles.keypad}>
      <Togglable />
      <Functional />
      <Control />
      <Numeric />
      <Arithmetic />
    </div>
  );
}