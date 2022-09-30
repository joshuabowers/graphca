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
    <div className={[styles.normal, props.show && styles.visible].join(' ')}>
      {
        props.for.log.map(({input, output, action}, i) => {
          const Wi = W.unit(input), Wo = W.unit(output)
          console.log( Wi, Wo, action )
          if(!isTreeNode(Wi)){ throw new Error('Received non-TreeNode input')}
          if(!isTreeNode(Wo)){ throw new Error('Received non-TreeNode output')}
          return <React.Fragment key={i}>
            <span className={styles.step} />
            <span className={styles.input}><Expression node={Wi} /></span>
            <span className={styles.output}><Expression node={Wo} /></span>
            <span className={styles.action}>{action}</span>
          </React.Fragment>
        })
      }
    </div>
  )
}
