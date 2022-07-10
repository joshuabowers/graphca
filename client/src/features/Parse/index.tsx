import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { parser, Scope } from "../../common/parser";
import { Expression } from "../Expression";
import { graph, removePlot } from '../Graph/Graph.slice';
import { forget } from '../Terminal/Terminal.slice';
import { stringify, Nil, Real, Complex } from '../../common/Tree';
import { is } from '../../common/Tree/is';
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
    const canPlot = !(is(Nil)(output)
      || (is(Real)(output) && !Number.isFinite(output.value))
      || (is(Complex)(output) && (!Number.isFinite(output.a) || !Number.isFinite(output.b))))

    const plot = {expression: asString, enteredAt: props.enteredAt}
    return <div className={styles.result}>
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
        <button className='material-icons' onClick={() => dispatch(forget(props.enteredAt))}>
          remove
        </button>
      </div>
    </div>
  } catch(error: any) {
    console.error(error)
    return <div className={styles.error}>{error.message}</div>
  }
}
