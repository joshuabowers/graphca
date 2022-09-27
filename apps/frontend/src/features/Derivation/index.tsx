import React from 'react'
import { W, TreeNode } from '@bowers/calcula'
import styles from './Derivation.module.css'

export interface DerivationProps {
  for: W.Writer<TreeNode>,
  show: boolean
}

export const Derivation = (props: DerivationProps) => {
  return (
    <ol className={[styles.normal, props.show && styles.visible].join(' ')}>
      {
        props.for.log.map(({input, action}, i) => {
          return <li key={i}>{action}</li>
        })
      }
    </ol>
  )
}
