import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clear } from "../Graph/Graph.slice";
import styles from './GraphControls.module.css';

export interface GraphControlProps {

}

export const GraphControls = (props: GraphControlProps) => {
  const dispatch = useAppDispatch()
  const graph = useAppSelector(state => state.graph)

  return <div className={styles.default}>
    <button
      disabled
      className='material-icons'>
      near_me
    </button>
    <button 
      disabled={graph.plots.length === 0}
      className='material-icons'
      onClick={() => dispatch(clear())}>
      clear
    </button>
  </div>
}
