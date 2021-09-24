import React from 'react';
import { useAppSelector } from '../../app/hooks';
import styles from './Terminal.module.css';

export interface TerminalProps {

}

export const Terminal = (props: TerminalProps) => {
  const history = useAppSelector((state) => state.terminal.history);
  const currentLine = useAppSelector((state) => state.terminal.currentLine);
  return (
    <ol className={styles.terminal}>
      {
        history.map((item) => 
          <li key={item.enteredAt}>{item.content}</li>
        )
      }
      <li>{currentLine}</li>
    </ol>
  )
}