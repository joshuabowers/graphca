import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { scope as createScope } from '@bowers/calcula'
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
    ), //as OutputSelector<RootState, JSX.Element[], (elem: TerminalEntryState) => JSX.Element>,
    [scope]
  )

  const currentRef = useRef<HTMLLIElement>(null)
  const history = useAppSelector(getHistory);
  const currentLine = useAppSelector(getCurrentLine);
  const parsings = useAppSelector(getParsings)

  /**
   * While the last entry in the parsings list is a good default for the
   * entry to auto-scroll to/focus on, it would be good to allow the individual
   * entries to signal a priority override: this would allow the entry to
   * ensure its visibility upon altering the terminal in some fashion. The
   * most likely use case for this is showing/hiding the derivation for the
   * entry. This could be facilitated by having state be updated in the
   * appropriate dispatched actions triggered in EventControls.
   */
  useLayoutEffect(() => {
    currentRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [currentRef, history])

  return (
    <div className={styles.normal}>
      {
        history.map((item, key) =>
          <React.Fragment key={item.enteredAt}>
            <span className={styles.reference}
              ref={key+1 === parsings.length ? currentRef : undefined}
            />
            {parsings[key]}
          </React.Fragment>
        )
      }
      <span ref={currentRef} className={styles.currentMarker} />
      <span className={styles.currentLine}>{currentLine}<span className={styles.caret}>|</span></span>
    </div>
  )
}