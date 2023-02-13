import React from 'react'
import { W, TreeNode, Operation, isTreeNode, stringify } from '@bowers/calcula'
import { Expression } from '../Expression'
import styles from './Derivation.module.css'

export interface DerivationProps {
  for: W.Writer<TreeNode, Operation>,
  show: boolean
}

const areTreeNodes = (
  v: W.Writer<unknown, Operation>[]
): v is W.Writer<TreeNode, Operation>[] => 
  v.every(isTreeNode)

const wrap = (node: W.Writer<unknown, Operation>) => {
  if(!isTreeNode(node)){ throw new Error('Received non-TreeNode object')}
  return stringify(node)
}

export const Derivation = (props: DerivationProps) => {
  return (
    <div className={[styles.normal, props.show && styles.visible].join(' ')}>
      {
        props.for.log.map(({action}, i) => {
          return <React.Fragment key={i}>
            <span className={styles.action}>{action}</span>
          </React.Fragment>
        })
        // props.for.log.map(({input, rewrite, action}, i) => {
        //   // const Wis = inputs.map(W.unit)
        //   const inputAsString = input(wrap)
        //   const output = rewrite(wrap)
        //   console.log( inputAsString, output, action )
        //   // if(!areTreeNodes(Wis)){ throw new Error('Received non-TreeNode input') }
        //   return <React.Fragment key={i}>
        //     <span className={styles.step} />
        //     <span className={styles.inputs}>
        //       {inputAsString}
        //       {/* { Wis.map((Wi, j) => <Expression node={Wi} key={j} />) } */}
        //     </span>
        //     <span className={styles.output}>{output}</span>
        //     <span className={styles.action}>{action}</span>
        //   </React.Fragment>
        // })
      }
    </div>
  )
}
