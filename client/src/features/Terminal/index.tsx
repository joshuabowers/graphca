import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { parse, Scope, scope as createScope } from '../../common/parse'
import styles from './Terminal.module.css';
import { RootState } from '../../app/store';
import { createArraySelector } from 'reselect-map';
import { TerminalEntryState } from './Terminal.slice';
import { createSelector, OutputSelector } from 'reselect';

export interface TerminalProps {

}

const getTerminal = (state: RootState) => state.terminal
const getCurrentLine = createSelector(
  getTerminal,
  terminal => terminal.currentLine.join('')
)
const getHistory = createSelector(getTerminal, (terminal) => terminal.history)

export const Terminal = (props: TerminalProps) => {
  const [scope, setScope] = useState(createScope())
  const getParsings = useMemo(
    () => createArraySelector<RootState, TerminalEntryState, JSX.Element>(
      (state: RootState) => state.terminal.history,
      (entry: TerminalEntryState) => parse(entry.content, scope, styles)
    ) as OutputSelector<RootState, JSX.Element[], (elem: TerminalEntryState) => JSX.Element>,
    [scope]
  )

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
          <li key={item.enteredAt}>{item.content}{parsings[key]}</li>
        )
      }
      <li ref={currentRef}>{currentLine}</li>
    </ol>
  )
}