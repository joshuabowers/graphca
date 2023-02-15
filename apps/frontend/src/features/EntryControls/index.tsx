import React from 'react'
import { useAppDispatch } from '../../app/hooks'
import { Plot, graph, removePlot } from '../Graph/Graph.slice'
import { toggleDerivation, forget } from '../Terminal/Terminal.slice';
import styles from './EntryControls.module.css'

export interface EntryControlsProps {
  canPlot: boolean,
  isPlotted: Plot | undefined,
  hasError: boolean,
  showDerivation: boolean,
  enteredAt: number,
  plot: Plot
}

export const EntryControls = (props: EntryControlsProps) => {
  const dispatch = useAppDispatch()
  return <div className={styles.entryControls}>
    {
      props.canPlot && !props.isPlotted && 
      <button className='material-icons' onClick={() => dispatch(graph(props.plot))}>
        visibility
      </button>
    }
    {
      props.canPlot && props.isPlotted &&
      <button className='material-icons' onClick={() => dispatch(removePlot(props.enteredAt))}>
        visibility_off
      </button>
    }
    {
      props.canPlot &&
      <button 
        className={['material-icons', styles.plotColor].join(' ')}
        style={{'--plotColor': props.isPlotted?.color ?? 'gray'} as React.CSSProperties}
        disabled>
          circle
      </button>
    }
    {
      !props.hasError &&
      <button className='material-icons' onClick={() => dispatch(toggleDerivation(props.enteredAt))}>
      {
        props.showDerivation ? 'expand_less' : 'expand_more'
      }
      </button>
    }
    <button className='material-icons' onClick={() => dispatch(forget(props.enteredAt))}>
      remove
    </button>
  </div>
}
