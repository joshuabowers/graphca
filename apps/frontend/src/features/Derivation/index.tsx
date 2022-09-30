import React from 'react'
import { W, TreeNode, isTreeNode } from '@bowers/calcula'
import { Expression } from '../Expression'
import styles from './Derivation.module.css'

export interface DerivationProps {
  for: W.Writer<TreeNode>,
  show: boolean
}

const areTreeNodes = (v: W.Writer<unknown>[]): v is W.Writer<TreeNode>[] => 
  v.every(isTreeNode)

export const Derivation = (props: DerivationProps) => {
  return (
    <div className={[styles.normal, props.show && styles.visible].join(' ')}>
      {
        props.for.log.map(({inputs, output, action}, i) => {
          const Wis = inputs.map(W.unit), Wo = W.unit(output)
          console.log( Wis, Wo, action )
          if(!areTreeNodes(Wis)){ throw new Error('Received non-TreeNode input') }
          if(!isTreeNode(Wo)){ throw new Error('Received non-TreeNode output')}
          return <React.Fragment key={i}>
            <span className={styles.step} />
            <span className={styles.inputs}>
              { Wis.map((Wi, j) => <Expression node={Wi} key={j} />) }
            </span>
            <span className={styles.output}><Expression node={Wo} /></span>
            <span className={styles.action}>{action}</span>
          </React.Fragment>
        })
      }
    </div>
  )
}
