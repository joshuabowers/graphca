import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  W, TreeNode, Operation,
  parser, Scope, isNil, isBoolean, isReal, isComplex, stringify
} from '@bowers/calcula'
import { Expression } from "../Expression";
import { Fusion } from '../Fusion';
import { Derivation } from '../Derivation';
import { Plot, graph, removePlot } from '../Graph/Graph.slice';
import { toggleDerivation, forget } from '../Terminal/Terminal.slice';
import { EntryControls } from '../EntryControls';
import styles from './Parse.module.css'

export type ParseProps = {
  enteredAt: number,
  input: string,
  scope: Scope,
}

export const Parse = (props: ParseProps) => {
  console.log('parsing expression:', props.input)
  const plotted = useAppSelector(state => state.graph.plots);
  let isPlotted: Plot|undefined = undefined, canPlot = false,
    showDerivation = false, asString: string = '',
    output: W.Writer<TreeNode, Operation>|undefined = undefined,
    error: string|undefined = undefined

  try {
    output = parser.value(props.input, {context: props.scope})
    asString = stringify(output)
    isPlotted = plotted.find(item => item.enteredAt === props.enteredAt)
    canPlot = !(isNil(output)
      || isBoolean(output)
      || (isReal(output) && !Number.isFinite(output.value.value))
      || (isComplex(output) && (!Number.isFinite(output.value.a) || !Number.isFinite(output.value.b))))
    showDerivation = useAppSelector(state => state.terminal.history.find(item => item.enteredAt === props.enteredAt)?.showDerivation || false)
  } catch(err: unknown) {
    error = (err as Error).message
    console.error(error)
  }
  return <div className={styles.entry}>
    <span className={styles.marker} />
    <span className={styles.input}>
      <Fusion mode="light" toFuse={props.input.split(/\b/)} />
    </span>
    <span className={styles.controls}>
      <EntryControls canPlot={canPlot} isPlotted={isPlotted} 
        showDerivation={showDerivation} enteredAt={props.enteredAt}
        hasError={error !== undefined}
        plot={{expression: asString, enteredAt: props.enteredAt}} />
    </span>
    <span className={styles.resultMarker}>{'=>'}</span>
    { 
      output && !error
        ? <div className={styles.output}><Expression node={output} /></div>
        : <div className={styles.error}>{error}</div>
    }
    {
      output && <div className={styles.derivation}>
        <Derivation for={output} show={showDerivation} />
      </div>
    }
  </div>
}
