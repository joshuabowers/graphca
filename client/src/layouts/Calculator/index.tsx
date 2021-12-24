import React from 'react';
import styles from './Calculator.module.css';
import { Keypad } from '../Keypad';
import { Graph } from '../../features/Graph';
import { GraphControls } from '../../features/GraphControls';
import { Terminal } from '../../features/Terminal';

export interface CalculatorProps {

}

export const Calculator = (props: CalculatorProps) => {
  return (
    <main className={styles.calculator}>
      <header>
        <h1>GraphCa</h1>
      </header>
      <footer></footer>
      <Graph />
      <GraphControls />
      <Terminal />
      <Keypad />
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