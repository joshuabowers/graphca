import React from 'react'
import { W, TreeNode, Operation } from '@bowers/calcula'
import { Fusion } from '../Fusion'
import styles from './Derivation.module.css'

export interface DerivationProps {
  for: W.Writer<TreeNode, Operation>,
  show: boolean
}

export const Derivation = (props: DerivationProps) => {
  return (
    <div className={[styles.normal, props.show && styles.visible].join(' ')}>
      {
        props.show && 
        props.for.log.map(({particles, action}, i) => {
          return <React.Fragment key={i}>
            <span className={styles.step} />
            <span className={styles.fusion}><Fusion toFuse={particles} /></span>
            <span className={styles.separator}>&mdash;</span>
            <span className={styles.action}>{action}</span>
          </React.Fragment>
        })
      }
    </div>
  )
}
