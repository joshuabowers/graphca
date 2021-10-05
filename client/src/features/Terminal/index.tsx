import React, { useLayoutEffect, useRef } from 'react';
import { useAppSelector } from '../../app/hooks';
import { parser } from '../../common/parser';
import { componentVisitor } from '../../common/visitors/componentVisitor';
import { evaluateVisitor } from '../../common/visitors/evaluateVisitor';
import styles from './Terminal.module.css';
import { RootState } from '../../app/store';
import { createArraySelector } from 'reselect-map';
import { TerminalEntryState } from './Terminal.slice';
import { createSelector, OutputSelector } from 'reselect';

export interface TerminalProps {

}

const parse = (entry: TerminalEntryState) => {
  console.log('parsing expression: ', entry.content)
  return parser.value(
    entry.content,
    {visit: [evaluateVisitor, componentVisitor]}
  ) as JSX.Element
}

const getTerminal = (state: RootState) => state.terminal
const getCurrentLine = createSelector(
  getTerminal,
  terminal => terminal.currentLine.join('')
)
const getHistory = createSelector(getTerminal, (terminal) => terminal.history)
const getParsings = createArraySelector<RootState, TerminalEntryState, JSX.Element>(
  (state: RootState) => state.terminal.history,
  (entry: TerminalEntryState) => parse(entry)
) as OutputSelector<RootState, JSX.Element[], (elem: TerminalEntryState) => JSX.Element>

export const Terminal = (props: TerminalProps) => {
  const currentRef = useRef<HTMLLIElement>(null)
  const history = useAppSelector(getHistory);
  const currentLine = useAppSelector(getCurrentLine);
  const parsings = useAppSelector(getParsings)

  useLayoutEffect(() => {
    currentRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [currentRef, history])
  return (
    <ol reversed start={history.length} className={styles.terminal}>
      {
        history.map((item, key) => 
          <li key={item.enteredAt}>{item.content}<div>{'=>'} {parsings[key]}</div></li>
        )
      }
      <li ref={currentRef}>{currentLine}</li>
    </ol>
  )
}