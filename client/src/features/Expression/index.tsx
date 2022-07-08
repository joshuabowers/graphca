import React from 'react'
import { method, multi, Multi } from '@arrows/multimethod'
import { is } from '../../common/Tree/is'
import styles from './Expression.module.css'
import {
  Base, Unary, Binary,
  Real, Complex, Variable, Addition, Multiplication, Exponentiation,
  Logarithm, AbsoluteValue, Gamma, Factorial,
  Trigonometric, Arcus, Hyperbolic, AreaHyperbolic,
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  Permutation, Combination,
  real, multiply, negate, reciprocal, Polygamma
} from '../../common/Tree'
import { Unicode } from '../../common/MathSymbols'

type FnNameFn<T extends Unary> = Multi & ((node: T) => string)

const trigonometric: FnNameFn<Trigonometric> = multi(
  method(is(Cosine), 'cos'),
  method(is(Sine), 'sin'),
  method(is(Tangent), 'tan'),
  method(is(Secant), 'sec'),
  method(is(Cosecant), 'csc'),
  method(is(Cotangent), 'cot')
)

const arcus: FnNameFn<Arcus> = multi(
  method(is(ArcusCosine), 'acos'),
  method(is(ArcusSine), 'asin'),
  method(is(ArcusTangent), 'atan'),
  method(is(ArcusSecant), 'asec'),
  method(is(ArcusCosecant), 'acsc'),
  method(is(ArcusCotangent), 'acot'),
)

const hyperbolic: FnNameFn<Hyperbolic> = multi(
  method(is(HyperbolicCosine), 'cosh'),
  method(is(HyperbolicSine), 'sinh'),
  method(is(HyperbolicTangent), 'tanh'),
  method(is(HyperbolicSecant), 'sech'),
  method(is(HyperbolicCosecant), 'csch'),
  method(is(HyperbolicCotangent), 'coth'),
)

const areaHyperbolic: FnNameFn<AreaHyperbolic> = multi(
  method(is(AreaHyperbolicCosine), 'acosh'),
  method(is(AreaHyperbolicSine), 'asinh'),
  method(is(AreaHyperbolicTangent), 'atanh'),
  method(is(AreaHyperbolicSecant), 'asech'),
  method(is(AreaHyperbolicCosecant), 'acsch'),
  method(is(AreaHyperbolicCotangent), 'acoth'),
)

const unary: FnNameFn<Unary> = multi(
  method(is(AbsoluteValue), 'abs'),
  method(is(Gamma), Unicode.gamma)
)

type LogarithmNameFn = Multi
  & ((base: Real) => string)
  & ((base: Base) => string)

const logarithm: LogarithmNameFn = multi(
  method(real(2), 'lb'),
  method(real(Math.E), 'ln'),
  method(real(10), 'lg'),
  method('log')
)

const isNegative = multi(
  method(is(Real), (e: Real) => e.value < 0),
  method(is(Multiplication), (e: Multiplication) => isNegative(e.left) || isNegative(e.right)),
  method(false)
)

const isReciprocal = multi(
  method(is(Exponentiation), (e: Exponentiation) => isNegative(e.right)),
  method(false)
)

const notAny = <T extends Base>(...types: (new(...args: any[]) => T)[]) => (value: unknown) => types.every((type) => !(value instanceof type))

const identity = (n: JSX.Element) => n
const wrap = (n: JSX.Element) => <>({n})</>

type ParenthesizeFn = Multi
  & ((node: Binary, child: Base) => (component: JSX.Element) => JSX.Element)

const parenthesize: ParenthesizeFn = multi(
  method([is(Multiplication), is(Addition)], () => wrap),
  method([is(Multiplication), is(Multiplication)], () => wrap),
  method([is(Exponentiation), notAny<Base>(Real, Variable)], () => wrap),
  method(() => identity)
)

const specialNumbers = new Map([
  [Number.POSITIVE_INFINITY.toString(), Unicode.infinity],
  [Number.NEGATIVE_INFINITY.toString(), `-${Unicode.infinity}`],
  [Math.PI.toString(), Unicode.pi],
  [Math.E.toString(), Unicode.e]
])

const symbolic = (value: number): string => {
  const converted = String(value)
  return specialNumbers.get(converted) ?? converted
}

const symA = (n: number) => symbolic(Math.abs(n))
const symB = (n: number, v = Math.abs(n)) => `${v === 1 ? '' : symbolic(v)}${Unicode.i}`
const isP = (n: number) => n > 0
const isN = (n: number) => n < 0
const is0 = (n: number) => n === 0

type NumericComp = (n: number) => boolean

const are = (aFn: NumericComp, bFn: NumericComp) =>
  (a: number, b: number) => aFn(a) && bFn(b)

type StringifyComplexFn = Multi & ((a: number, b: number) => string)

const stringifyComplex: StringifyComplexFn = multi(
  method(are(is0, is0), () => '0'),
  method([Infinity, NaN], () => Unicode.complexInfinity),
  method(are(is0, isP), (_a: number, b: number) => symB(b)),
  method(are(is0, isN), (_a: number, b: number) => `-${symB(b)}`),
  method(are(isP, is0), (a: number, _b: number) => symA(a)),
  method(are(isN, is0), (a: number, _b: number) => `-${symA(a)}`),
  method(are(isP, isN), (a: number, b: number) => `${symA(a)} - ${symB(b)}`),
  method(are(isN, isN), (a: number, b: number) => `-${symA(a)} - ${symB(b)}`),
  method((a: number, b: number) => `${symA(a)} + ${symB(b)}`)
)

type when<T> = (expression: T) => JSX.Element

const whenReal: when<Real> = e => 
  <span className={[styles.constant, styles.real].join(' ')}>
    {symbolic(e.value)}
  </span>

const whenComplex: when<Complex> = e => 
  <span className={[styles.constant, styles.complex].join(' ')}>
    {stringifyComplex(e.a, e.b)}
  </span>

const whenVariable: when<Variable> = e => (
  e.value
    ? componentize(e.value)
    : <span className={styles.variable}>
        {e.name}
      </span>
)

const binary = (className: string, operator: string, l: JSX.Element, r: JSX.Element) => (
  <span className={[styles.binary, styles[className]].join(' ')}>
    {l}
    <span className={styles.operator}>{operator}</span>
    {r}
  </span>
)

const whenAddition: when<Addition> = e => {
  const lNegative = isNegative(e.left), rNegative = isNegative(e.right)
  const either = lNegative || rNegative, lExclusive = lNegative && !rNegative
  const left = lExclusive ? e.right : e.left, 
    right = lExclusive ? e.left : e.right
  const l = componentize(left), 
    r = componentize(either ? negate(right) : right)
  const className = either ? 'subtraction' : 'addition'
  const operator = either ? Unicode.minus : '+'
  return binary(className, operator, parenthesize(e, left)(l), parenthesize(e, right)(r))
}

const whenMultiplication: when<Multiplication> = e => {
  const lReciprocal = isReciprocal(e.left), rReciprocal = isReciprocal(e.right)
  const either = lReciprocal || rReciprocal, lExclusive = lReciprocal && !rReciprocal
  const both = lReciprocal && rReciprocal
  const reorderLeft = lExclusive ? e.right : e.left,
    reorderRight = lExclusive ? e.left : e.right
  const left = both ? real(1) : reorderLeft,
    right = both ? multiply(reciprocal(reorderLeft), reciprocal(reorderRight)) : (
      rReciprocal ? reciprocal(reorderRight) : reorderRight
    )
  const lNegative = left instanceof Real && left.value === -1
  const l = componentize(left), r = componentize(right)
  const className = either ? 'division' : (lNegative ? 'negation' : 'multiplication')
  const operator = either ? Unicode.division : (lNegative ? Unicode.minus : Unicode.multiplication)
  return binary(
    className, operator, 
    className === 'negation' ? <></> : parenthesize(e, left)(l), 
    parenthesize(e, right)(r)
  )
}

const whenExponentiation: when<Exponentiation> = e => {
  const l = componentize(e.left), r = componentize(e.right)
  return binary('exponentiation', '^', parenthesize(e, e.left)(l), parenthesize(e, e.right)(r))
}

const whenLogarithm: when<Logarithm> = e => {
  const functionName = logarithm(e.left)
  const base = functionName === 'log' ? componentize(e.left) : <></>
  return <span className={[styles.functional, styles.logarithmic].join(' ')}>
    {functionName}<span className={styles.sub}>{base}</span>({componentize(e.right)})
  </span>
}

const createUnary = <T extends Unary>(metaClass: string, fnNames: FnNameFn<T>): when<T> =>
  (node: T) =>
    <span className={[styles.functional, styles[metaClass]].join(' ')}>
      {fnNames(node)}({componentize(node.expression)})
    </span>

const whenTrigonometric = createUnary('trigonometric', trigonometric)
const whenArcus = createUnary('arcus', arcus)
const whenHyperbolic = createUnary('hyperbolic', hyperbolic)
const whenAreaHyperbolic = createUnary('areaHyperbolic', areaHyperbolic)
const whenUnary = createUnary('unary', unary)

const whenFactorial: when<Factorial> = e => {
  const child = componentize(e.expression)
  const shouldWrap = e.expression instanceof Binary
  return <span className={styles.factorial}>
    {shouldWrap ? <>({child})</> : child}!
  </span>
}

const whenPolygamma: when<Polygamma> = e => {
  const order = componentize(e.left)
  const expression = componentize(e.right)
  return <span className={[styles.functional, styles.polygamma].join(' ')}>
    {Unicode.digamma}<span className={styles.super}><span>({order})</span></span>({expression})
  </span>
}

const createCombinatorial = (fnName: string) =>
  (node: Binary) => {
    const l = componentize(node.left), r = componentize(node.right)
    return <span className={[styles.functional, styles.combinatorial].join(' ')}>
      {fnName}({l}, {r})
    </span>
  }

const whenPermutation = createCombinatorial('P')
const whenCombination = createCombinatorial('C')

const whenBase: when<Base> = e => <span className={styles.unhandled}>Unhandled: {e.$kind}</span>

export type ComponentizeFn = Multi
  & typeof whenReal & typeof whenComplex & typeof whenVariable
  & typeof whenAddition & typeof whenMultiplication 
  & typeof whenExponentiation & typeof whenLogarithm
  & typeof whenTrigonometric & typeof whenArcus
  & typeof whenHyperbolic & typeof whenAreaHyperbolic
  & typeof whenUnary & typeof whenFactorial & typeof whenPolygamma
  & typeof whenPermutation & typeof whenCombination
  & typeof whenBase

export const componentize: ComponentizeFn = multi(
  method(is(Real), whenReal),
  method(is(Complex), whenComplex),
  method(is(Variable), whenVariable),

  method(is(Addition), whenAddition),
  method(is(Multiplication), whenMultiplication),
  method(is(Exponentiation), whenExponentiation),
  method(is(Logarithm), whenLogarithm),

  method(is(Trigonometric), whenTrigonometric),
  method(is(Arcus), whenArcus),
  method(is(Hyperbolic), whenHyperbolic),
  method(is(AreaHyperbolic), whenAreaHyperbolic),
  method(is(Factorial), whenFactorial),
  method(is(Unary), whenUnary),
  method(is(Polygamma), whenPolygamma),

  method(is(Permutation), whenPermutation),
  method(is(Combination), whenCombination),

  method(is(Base), whenBase)
)

export type ExpressionProps = {
  node: Base
}

export type ExpressionComponent = (props: ExpressionProps) => JSX.Element

export const Expression: ExpressionComponent = (props) =>
  componentize(props.node)
