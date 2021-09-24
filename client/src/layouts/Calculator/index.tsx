import React from 'react';
import styles from './Calculator.module.css';
import { Keypad } from '../Keypad';
import { Graph } from '../../features/Graph';
import { Terminal } from '../../features/Terminal';

export interface CalculatorProps {

}

export const Calculator = (props: CalculatorProps) => {
  return (
    <main className={styles.calculator}>
      <Keypad />
      <Graph />
      <Terminal />
      {/* <Keypad />
      <Tabs>
        <Tab>
          <Graph />
        </Tab>
      </Tabs>
      <Tabs under>
        <Tab>
          <Terminal />
        </Tab>
      </Tabs> */}
    </main>
  )
}