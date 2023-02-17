import React from 'react'
import { Multi, multi, method } from '@arrows/multimethod'
import { 
  Particle, Unicode, 
  connectives, inequality, additive, multiplicative,
  functions
} from '@bowers/calcula'
import styles from './Fusion.module.css'

export type FusionProps = {
  toFuse: Particle,
  mode: "light"|"dark"
}

type FusionFn = Multi
  & ((particles: Particle) => JSX.Element)

const operators = [
  ...connectives.keys(), ...inequality.keys(),
  ...additive.keys(), ...multiplicative.keys(), 
  '^', ':=', Unicode.not
]

const functional = [
  ...functions.keys(), 'P', 'C', 'log', Unicode.digamma, Unicode.derivative
].map(s => escapeRegExp(s))

const sign = Array.from(additive.keys(), s => escapeRegExp(s))

const specialNumber = [
  Unicode.e, Unicode.pi, Unicode.infinity, Unicode.complexInfinity
].map(s => escapeRegExp(s))

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const isReal = /(?:-?)(?:0|[1-9][0-9]*|(?=\.))(?:\.[0-9]+)?(?:E\-?(?:[1-9][0-9]*)+)?/
const isComplex = new RegExp(`(((${isReal.source})?${sign})?${isReal.source})?${Unicode.i}`)
const isBoolean = /true|false/
const isSpecialNumber = new RegExp(`${specialNumber.join('|')}`)
const isNilOrNaN = /nil|NaN/
const isGrouping = /[\(\)\[\]\{\}]/
const isOperator = new RegExp(operators.map(s => escapeRegExp(s)).join('|'))
const isFunction = new RegExp(functional.join('|'))

const isXnor = new RegExp(Unicode.xnor)
const isXor = new RegExp(Unicode.xor)
const isImplies = new RegExp(Unicode.implies)
const isConverse = new RegExp(Unicode.converse)

const isConstant = new RegExp(`${isReal.source}|${isBoolean.source}|${isComplex.source}|${isSpecialNumber.source}`)

const highlight = (className: string|string[], override?: string) => (s: string) => 
  <span className={Array.isArray(className) ? className.join(' ') : className}>{override ?? s}</span>

const fusion: FusionFn = multi(
  method(
    Array.isArray, 
    (a: Particle[]) => <>{
      a.map((p, i) => <React.Fragment key={i}>{fusion(p)}</React.Fragment>)
    }</>
  ),
  method(isConstant, highlight(styles.constant)),
  method(isNilOrNaN, highlight(styles.nan)),
  method(isGrouping, highlight(styles.grouping)),
  method(isXnor, highlight([styles.operator, styles.small], '<->')),
  method(isXor, highlight(styles.icon)),
  method(isImplies, highlight([styles.operator, styles.small], '->')),
  method(isConverse, highlight([styles.operator, styles.small], '<-')),
  method(isOperator, highlight(styles.operator)),
  method(isFunction, highlight(styles.function)),
  method(highlight(styles.variable))
)

export const Fusion = (props: FusionProps) =>
  <span className={[styles.matter, styles[props.mode]].join(' ')}>{fusion(props.toFuse)}</span>
