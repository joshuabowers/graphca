import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { scope as createScope } from '../../common/parser'
import { Parse } from '../Parse';
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
  const [scope] = useState(createScope()) // note: setScope could be provided here.
  const getParsings = useMemo(
    () => createArraySelector<RootState, TerminalEntryState, JSX.Element>(
      (state: RootState) => state.terminal.history,
      (entry: TerminalEntryState) => <Parse enteredAt={entry.enteredAt} input={entry.content} scope={scope} />
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
    <div className={styles.normal}>
      <ol className={styles.history}>
        {
          history.map((item, key) => 
            <li key={item.enteredAt}>{item.content}{parsings[key]}</li>
          )
        }
        <li ref={currentRef}>{currentLine}</li>
      </ol>
    </div>
  )
}