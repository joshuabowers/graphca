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

export const Parse = (props: ParseProps) => {
  console.log('parsing expression:', props.input)
  try {
    const dispatch = useAppDispatch()
    const output = parser.value(props.input, {context: props.scope})
    return <div className={styles.result}>
      <span>{'=>'}</span>
      <Expression node={output} />
      <button className={styles.control} onClick={() => dispatch(graph(stringify(output)))}>
        <span className='material-icons'>multiline_chart</span>
        Graph
      </button>
    </div>
  } catch(error: any) {
    console.error(error)
    return <div className={styles.error}>{error.message}</div>
  }
}
