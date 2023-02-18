import React, { ClipboardEventHandler, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { scope as createScope } from '@bowers/calcula'
import { Parse } from '../Parse';
import styles from './Terminal.module.css';
import { RootState } from '../../app/store';
import { createArraySelector } from 'reselect-map';
import { TerminalEntryState } from './Terminal.slice';
import { createSelector, OutputSelector } from 'reselect';
import { Fusion } from '../Fusion';

export interface TerminalProps {

}

const getTerminal = (state: RootState) => state.terminal
const getCurrentLine = createSelector(
  getTerminal,
  terminal => terminal.currentLine.join('')
)
const getHistory = createSelector(getTerminal, (terminal) => terminal.history)
const getFocus = createSelector(getTerminal, (terminal) => terminal.focus)

export const Terminal = (props: TerminalProps) => {
  const [scope] = useState(createScope()) // note: setScope could be provided here.
  const getParsings = useMemo(
    () => createArraySelector<RootState, TerminalEntryState, JSX.Element>(
      (state: RootState) => state.terminal.history,
      (entry: TerminalEntryState) => <Parse enteredAt={entry.enteredAt} input={entry.content} scope={scope} />
    ), //as OutputSelector<RootState, JSX.Element[], (elem: TerminalEntryState) => JSX.Element>,
    [scope]
  )

  const currentRef = useRef<HTMLSpanElement>(null)
  const history = useAppSelector(getHistory);
  const currentLine = useAppSelector(getCurrentLine);
  const focus = useAppSelector(getFocus)
  const parsings = useAppSelector(getParsings)

  useLayoutEffect(() => {
    currentRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [currentRef, history, focus, currentLine])

  /**
   * Could be used to insert text into the app, bypassing the KeyPad...
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLSpanElement>) => console.log(e)

  return (
    <div className={styles.normal}>
      {
        history.map((item, key) =>
          <React.Fragment key={item.enteredAt}>
            {
              focus === item.enteredAt &&
              <span ref={currentRef} className={styles.reference} />
            }
            <header className={styles.markerTrack}>
              <h2 className={styles.marker} />
            </header>
            {parsings[key]}
          </React.Fragment>
        )
      }
      <span ref={!focus ? currentRef : undefined} className={styles.reference} />
      <h2 className={styles.currentMarker} />
      <span className={styles.currentLine} onPaste={handlePaste}>
        <Fusion mode="dark" toFuse={currentLine.split(/\b/)} />
        <span className={styles.caret}>|</span>
      </span>
    </div>
  )
}