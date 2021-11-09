import {Visitor, Node, $visit} from 'pegase'
import React from 'react'
import styles from './componentVisitor.module.css'
import { Unicode, MathSymbols } from '../../MathSymbols'

const renameFunctions: Map<string, string> = new Map([
  ['GAMMA', Unicode.gamma]
])

const binaryOp = (node: Node, op: MathSymbols) => (
  <span className={styles.binaryOp}>
    {$visit(node.a)} {op} {$visit(node.b)}
  </span>
)

const functional = (node: Node, metaClass: string) => (
  <span className={[styles.functional, styles[metaClass]].join(' ')}>
    {renameFunctions.get(node.$label) ?? node.$label.toLocaleLowerCase()}({$visit(node.expression)})
  </span>
)

const specialNumbers = new Map([
  [Number.POSITIVE_INFINITY.toString(), Unicode.infinity],
  [Number.NEGATIVE_INFINITY.toString(), `-${Unicode.infinity}`],
  [Math.PI.toString(), Unicode.pi]
])

export const componentVisitor: Visitor<JSX.Element> = {
  NUMBER: (node) => <span className={styles.number}>{specialNumbers.get(node.value) ?? node.value.toString()}</span>,
  REAL: (node) => <span className={styles.number}>{specialNumbers.get(node.value.toString()) ?? node.value.toString()}</span>,
  VARIABLE: (node) => <span className={styles.variable}>{node.name}</span>,
  E: (node) => <span className={styles.number}>{Unicode.e}</span>,
  I: (node) => <span className={styles.complex}>{node.value === 1 ? '' : node.value.toString()}{Unicode.i}</span>,
  COMPLEX: (node) => <span className={styles.complex}>{node.value.toString()}</span>,
  PI: (node) => <span className={styles.number}>{Unicode.pi}</span>,
  INFINITY: (node) => <span className={styles.number}>{Unicode.infinity}</span>,
  ADD: (node) => binaryOp(node, '+'),
  SUBTRACT: (node) => binaryOp(node, Unicode.minus),
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
  SINH: (node) => functional(node, 'hyperbolic'),
  COSH: (node) => functional(node, 'hyperbolic'),
  TANH: (node) => functional(node, 'hyperbolic'),
  ASINH: (node) => functional(node, 'arHyperbolic'),
  ACOSH: (node) => functional(node, 'arHyperbolic'),
  ATANH: (node) => functional(node, 'arHyperbolic'),
  LB: (node) => functional(node, 'logarithmic'),
  LN: (node) => functional(node, 'logarithmic'),
  LG: (node) => functional(node, 'logarithmic'),
  GAMMA: (node) => functional(node, 'gamma'),
  ABS: (node) => functional(node, 'absolute'),
  FACTORIAL: (node) => <span className={styles.factorial}>{$visit(node.expression)}!</span>
}