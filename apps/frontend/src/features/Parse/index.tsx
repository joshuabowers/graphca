import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  parser, Scope, isNil, isBoolean, isReal, isComplex, stringify
} from '@bowers/calcula'
import { Expression } from "../Expression";
import { Derivation } from '../Derivation';
import { graph, removePlot } from '../Graph/Graph.slice';
import { toggleDerivation, forget } from '../Terminal/Terminal.slice';
import styles from './Parse.module.css'

export type ParseProps = {
  enteredAt: number,
  input: string,
  scope: Scope,
}

export const Parse = (props: ParseProps) => {
  console.log('parsing expression:', props.input)
  const plotted = useAppSelector(state => state.graph.plots);
  try {
    const dispatch = useAppDispatch()
    const output = parser.value(props.input, {context: props.scope})
    const asString = stringify(output)
    const isPlotted = plotted.find(item => item.enteredAt === props.enteredAt)
    const canPlot = !(isNil(output)
      || isBoolean(output)
      || (isReal(output) && !Number.isFinite(output.value.value))
      || (isComplex(output) && (!Number.isFinite(output.value.a) || !Number.isFinite(output.value.b))))
    const showDerivation = useAppSelector(state => state.terminal.history.find(item => item.enteredAt === props.enteredAt)?.showDerivation || false)

    const plot = {expression: asString, enteredAt: props.enteredAt}
    return <div>
      <div className={styles.result}>
        <div className={styles.output}>
          <span>{'=>'}</span>
          <Expression node={output} />
        </div>
        <div className={styles.entryControls}>
          {canPlot && !isPlotted && 
          <button className='material-icons' onClick={() => dispatch(graph(plot))}>
            visibility
          </button>}
          {canPlot && isPlotted &&
          <button className='material-icons' onClick={() => dispatch(removePlot(props.enteredAt))}>
            visibility_off
          </button>}
          {canPlot &&
          <button 
            className={['material-icons', styles.plotColor].join(' ')}
            style={{'--plotColor': isPlotted?.color ?? 'gray'} as React.CSSProperties}
            disabled>
              circle
          </button>}
          <button className='material-icons' onClick={() => dispatch(toggleDerivation(props.enteredAt))}>
            {
              showDerivation ? 'expand_less' : 'expand_more'
            }
          </button>
          <button className='material-icons' onClick={() => dispatch(forget(props.enteredAt))}>
            remove
          </button>
        </div>
      </div>
      <Derivation for={output} show={showDerivation} />
    </div>
  } catch(error: any) {
    console.error(error)
    return <div className={styles.error}>{error.message}</div>
  }
}
