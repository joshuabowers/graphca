import React from 'react'
import { W, TreeNode, isTreeNode } from '@bowers/calcula'
import { Expression } from '../Expression'
import styles from './Derivation.module.css'

export interface DerivationProps {
  for: W.Writer<TreeNode>,
  show: boolean
}

const join = (elements: JSX.Element[]) =>
  elements.reduce((p, c) => !p ? c : <>{p}, {c}</>)

export const Derivation = (props: DerivationProps) => {
  return (
    <ol className={[styles.normal, props.show && styles.visible].join(' ')}>
      {
        props.for.log.map(({input, action}, i) => {
          const inputs = Array.isArray(input) ? input : [input]
          const asExpressions = inputs.map(i => <Expression node={W.unit(i)}/>)
          return <li key={i}>{join(asExpressions)}: {action}</li>
        })
      }
    </ol>
  )
}
