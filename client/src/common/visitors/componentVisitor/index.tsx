import {Visitor, Node, $visit} from 'pegase'
import React from 'react'
import styles from './componentVisitor.module.css'
import { Unicode, MathSymbols } from '../../MathSymbols'

const renameFunctions: Map<string, string> = new Map([
  ['GAMMA', Unicode.gamma],
  ['DIGAMMA', Unicode.digamma]
])

const binary = (op: MathSymbols) => (node: Node) => (
  <span className={styles.binaryOp}>
    {$visit(node.a)} {op} {$visit(node.b)}
  </span>
)

const functional = (metaClass: string) => (node: Node) => (
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
  ADD: binary('+'),
  SUBTRACT: binary(Unicode.minus),
  MULTIPLY: binary(Unicode.multiplication),
  DIVIDE: binary(Unicode.division),
  EXPONENT: (node) => (
    <span className={styles.exponent}>
      {$visit(node.a)}^{$visit(node.b)}
    </span>
  ),
  NEGATE: (node) => <span className={styles.negation}>{Unicode.minus}{$visit(node.expression)}</span>,
  SIN: functional('trigonometric'),
  COS: functional('trigonometric'),
  TAN: functional('trigonometric'),
  ASIN: functional('arcus'),
  ACOS: functional('arcus'),
  ATAN: functional('arcus'),
  SINH: functional('hyperbolic'),
  COSH: functional('hyperbolic'),
  TANH: functional('hyperbolic'),
  ASINH: functional('arHyperbolic'),
  ACOSH: functional('arHyperbolic'),
  ATANH: functional('arHyperbolic'),
  LB: functional('logarithmic'),
  LN: functional('logarithmic'),
  LG: functional('logarithmic'),
  GAMMA: functional('gamma'),
  DIGAMMA: functional('digamma'),
  ABS: functional('absolute'),
  FACTORIAL: (node) => <span className={styles.factorial}>{$visit(node.expression)}!</span>
}