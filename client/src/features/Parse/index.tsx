import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { parser, Scope } from "../../common/parser";
import { Expression } from "../Expression";
import { graph } from '../Graph/Graph.slice';
import { stringify } from '../../common/Tree';
import styles from './Parse.module.css'

export type ParseProps = {
  input: string,
  scope: Scope,
}

// TODO: Ensure that Expression is wrapped in some sort of flexed container,
// allowing the graph button to be placed to the right.
export const Parse = (props: ParseProps) => {
  console.log('parsing expression:', props.input)
  try {
    const dispatch = useAppDispatch()
    const output = parser.value(props.input, {context: props.scope})
    return <div className={styles.result}>
      <div className={styles.output}>
        <span>{'=>'}</span>
        <Expression node={output} />
      </div>
      <div className={styles.expressionControls}>
        <button className={styles.control} onClick={() => dispatch(graph(stringify(output)))}>
          <span className='material-icons'>multiline_chart</span>
          Graph
        </button>
      </div>
    </div>
  } catch(error: any) {
    console.error(error)
    return <div className={styles.error}>{error.message}</div>
  }
}
