import React from 'react';
import { parser, Scope } from "../../common/parser";
import { Expression } from "../Expression";
import styles from './Parse.module.css'

export type ParseProps = {
  input: string,
  scope: Scope,
}

export const Parse = (props: ParseProps) => {
  console.log('parsing expression:', props.input)
  try {
    const output = parser.value(props.input, {context: props.scope})
    return <div className={styles.result}>
      <span>{'=>'}</span>
      <Expression node={output} />
    </div>
  } catch(error: any) {
    return <div className={styles.error}>{error.message}</div>
  }
}
