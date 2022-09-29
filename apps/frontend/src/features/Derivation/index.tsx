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

// Expected derivation output:
// Generates a grid, where each row represents a step in the derivation
// Each row begins with a semantic counter element, followed by
// Expression wrapped TreeNodes for the input and output. The output cell
// should be left-aligned, with it's ::before having content='==='. The
// input cell should be right-aligned. Final cell within a row is the
// textual description of what is happening in that step.
// The description cell should have ::before content of '--'
// The Counter cell should be right-aligned, and preferably a different
// color to the rest of the row.
// E.g.:
// 1) 1 + 2 === 3 -- Real addition

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
