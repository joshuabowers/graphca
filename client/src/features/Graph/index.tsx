import React from 'react'
import styles from './Graph.module.css';

export interface GraphProps {

}

export const Graph = (props: GraphProps) => {
  return (
    <canvas className={styles.graph} />
  )
}