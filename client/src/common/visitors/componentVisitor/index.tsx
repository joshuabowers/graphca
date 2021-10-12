import {Visitor, Node, $visit} from 'pegase'
import React from 'react'
import styles from './componentVisitor.module.css'
import { Unicode, MathSymbols } from '../../MathSymbols'

const binaryOp = (node: Node, op: MathSymbols) => (
  <span className={styles.binaryOp}>
    {$visit(node.a)} {op} {$visit(node.b)}
  </span>
)

const functional = (node: Node, metaClass: string) => (
  <span className={[styles.functional, styles[metaClass]].join(' ')}>
    {node.$label.toLocaleLowerCase()}({$visit(node.expression)})
  </span>
)

const specialNumbers = new Map([
  [Number.POSITIVE_INFINITY.toString(), Unicode.infinity],
  [Number.NEGATIVE_INFINITY.toString(), `-${Unicode.infinity}`]
])

export const componentVisitor: Visitor<JSX.Element> = {
  NUMBER: (node) => <span className={styles.number}>{specialNumbers.get(node.value) ?? node.value}</span>,
  VARIABLE: (node) => <span className={styles.variable}>{node.name}</span>,
  PI: (node) => <span className={styles.number}>{Unicode.pi}</span>,
  INFINITY: (node) => <span className={styles.number}>{Unicode.infinity}</span>,
  PLUS: (node) => binaryOp(node, '+'),
  MINUS: (node) => binaryOp(node, Unicode.minus),
  MULTIPLY: (node) => binaryOp(node, Unicode.multiplication),
  DIVIDE: (node) => binaryOp(node, Unicode.division),
  EXPONENT: (node) => (
    <span className={styles.exponent}>
      {$visit(node.a)}^{$visit(node.b)}
    </span>
  ),
  NEGATE: (node) => <span className={styles.negation}>{Unicode.minus}{$visit(node.expression)}</span>,
  SIN: (node) => functional(node, 'trigonometric'),
  COS: (node) => functional(node, 'trigonometric'),
  TAN: (node) => functional(node, 'trigonometric'),
  ASIN: (node) => functional(node, 'arcus'),
  ACOS: (node) => functional(node, 'arcus'),
  ATAN: (node) => functional(node, 'arcus'),
  LB: (node) => functional(node, 'logarithmic'),
  LN: (node) => functional(node, 'logarithmic'),
  LG: (node) => functional(node, 'logarithmic'),
  FACTORIAL: (node) => <span className={styles.factorial}>{$visit(node.expression)}!</span>
}