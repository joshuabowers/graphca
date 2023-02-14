import React from 'react'
import { Multi, multi, method } from '@arrows/multimethod'
import { 
  Particle, Unicode, 
  connectives, inequality, additive, multiplicative,
  functions
} from '@bowers/calcula'
import styles from './Fusion.module.css'

export type FusionProps = {
  toFuse: Particle
}

type FusionFn = Multi
  & ((particles: Particle) => JSX.Element)

const operators = [
  ...connectives.keys(), ...inequality.keys(),
  ...additive.keys(), ...multiplicative.keys(), '^'
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
const isBinaryOp = new RegExp(operators.map(s => escapeRegExp(s)).join('|'))
const isFunction = new RegExp(functional.join('|'))

const isConstant = new RegExp(`${isReal.source}|${isBoolean.source}|${isComplex.source}|${isSpecialNumber.source}`)

const fusion: FusionFn = multi(
  method(
    Array.isArray, 
    (a: Particle[]) => <>{
      a.map((p, i) => <Fusion key={i} toFuse={p} />)
    }</>
  ),
  method(isConstant, (s: string) => <span className={styles.constant}>{s}</span>),
  method(isNilOrNaN, (s: string) => <span className={styles.nan}>{s}</span>),
  method(isGrouping, (s: string) => <span className={styles.grouping}>{s}</span>),
  method(isBinaryOp, (s: string) => <span className={styles.binaryOp}>{s}</span>),
  method(isFunction, (s: string) => <span className={styles.function}>{s}</span>),
  method((s: string) => <span className={styles.variable}>{s}</span>)
)

export const Fusion = (props: FusionProps) =>
  <span className={styles.matter}>{fusion(props.toFuse)}</span>
