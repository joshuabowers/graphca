import peg, {Visitor, Node, $visit} from 'pegase'
import React from 'react'
import styles from './componentVisitor.module.css'
import { Unicode, MathSymbols } from '../../MathSymbols'

const binaryOp = (node: Node, op: MathSymbols) => (
  <span className={styles.binaryOp}>
    {$visit(node.a)} {op} {$visit(node.b)}
  </span>
)

export const componentVisitor: Visitor<JSX.Element> = {
  NUMBER: (node) => <span className={styles.number}>{node.value}</span>,
  PLUS: (node) => binaryOp(node, '+'),
  MINUS: (node) => binaryOp(node, Unicode.minus),
  MULTIPLY: (node) => binaryOp(node, Unicode.multiplication),
  DIVIDE: (node) => binaryOp(node, Unicode.division),
}