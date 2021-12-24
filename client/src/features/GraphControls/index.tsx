import { useAppDispatch } from "../../app/hooks";
import { clear } from "../Graph/Graph.slice";
import styles from './GraphControls.module.css';

export interface GraphControlProps {

}

export const GraphControls = (props: GraphControlProps) => {
  const dispatch = useAppDispatch()

  return <div className={styles.default}>
    <button className='material-icons' onClick={() => dispatch(clear())}>clear</button>
  </div>
}
