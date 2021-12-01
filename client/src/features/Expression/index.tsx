import React from 'react'
import { method, multi, Multi, _ } from '@arrows/multimethod'
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
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent
} from '../../common/Tree/Expression'
import { real } from '../../common/Tree/real'
import { multiply, negate } from '../../common/Tree/multiplication'
import { reciprocal } from '../../common/Tree/exponentiation'
import { Unicode } from '../../common/MathSymbols'

type FnNameFn<T extends Unary> = Multi & ((node: T) => string)

const trigonometric: FnNameFn<Trigonometric> = multi(
  method(Cosine, 'cos'),
  method(Sine, 'sin'),
  method(Tangent, 'tan'),
  method(Secant, 'sec'),
  method(Cosecant, 'csc'),
  method(Cotangent, 'cot')
)

const arcus: FnNameFn<Arcus> = multi(
  method(ArcusCosine, 'acos'),
  method(ArcusSine, 'asin'),
  method(ArcusTangent, 'atan'),
  method(ArcusSecant, 'asec'),
  method(ArcusCosecant, 'acsc'),
  method(ArcusCotangent, 'acot'),
)

const hyperbolic: FnNameFn<Hyperbolic> = multi(
  method(HyperbolicCosine, 'cosh'),
  method(HyperbolicSine, 'sinh'),
  method(HyperbolicTangent, 'tanh'),
  method(HyperbolicSecant, 'sech'),
  method(HyperbolicCosecant, 'csch'),
  method(HyperbolicCotangent, 'coth'),
)

const areaHyperbolic: FnNameFn<AreaHyperbolic> = multi(
  method(AreaHyperbolicCosine, 'acosh'),
  method(AreaHyperbolicSine, 'asinh'),
  method(AreaHyperbolicTangent, 'atanh'),
  method(AreaHyperbolicSecant, 'asech'),
  method(AreaHyperbolicCosecant, 'acsch'),
  method(AreaHyperbolicCotangent, 'acoth'),
)

const unary: FnNameFn<Unary> = multi(
  method(AbsoluteValue, 'abs'),
  method(Gamma, Unicode.gamma)
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
  method(Real, (e: Real) => e.value < 0),
  method(Multiplication, (e: Multiplication) => isNegative(e.left) || isNegative(e.right)),
  method(false)
)

const isReciprocal = multi(
  method(Exponentiation, (e: Exponentiation) => isNegative(e.right)),
  method(false)
)

const isInverse = (expression: Base) => isNegative(expression) || isReciprocal(expression)

const notAny = <T extends Base>(...types: (new(...args: any[]) => T)[]) => (value: unknown) => types.every((type) => !(value instanceof type))

const identity = (n: JSX.Element) => n
const wrap = (n: JSX.Element) => <>({n})</>

type ParenthesizeFn = Multi
  & ((node: Binary, child: Base) => (component: JSX.Element) => JSX.Element)

const parenthesize: ParenthesizeFn = multi(
  method([Multiplication, Addition], () => wrap),
  method([Multiplication, Multiplication], () => wrap),
  method([Exponentiation, notAny<Base>(Real, Variable)], () => wrap),
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

type StringifyComplexFn = Multi & ((a: number, b: number) => string)

const stringifyComplex: StringifyComplexFn = multi(
  method([0, 0], () => '0'),
  method([0, isP], (_a: number, b: number) => symB(b)),
  method([0, isN], (_a: number, b: number) => `-${symB(b)}`),
  method([isP, 0], (a: number, _b: number) => symA(a)),
  method([isN, 0], (a: number, _b: number) => `-${symA(a)}`),
  method([isP, isN], (a: number, b: number) => `${symA(a)} - ${symB(b)}`),
  method([isN, isN], (a: number, b: number) => `-${symA(a)} - ${symB(b)}`),
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

const whenVariable: when<Variable> = e => 
  <span className={styles.variable}>
    {e.name}
  </span>

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
    lNegative ? <></> : parenthesize(e, left)(l), 
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
    {functionName}{base}({componentize(e.right)})
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

const whenBase: when<Base> = e => <span className={styles.unhandled}>Unhandled: {e.$kind}</span>

export type ComponentizeFn = Multi
  & typeof whenReal & typeof whenComplex & typeof whenVariable
  & typeof whenAddition & typeof whenMultiplication 
  & typeof whenExponentiation & typeof whenLogarithm
  & typeof whenTrigonometric & typeof whenArcus
  & typeof whenHyperbolic & typeof whenAreaHyperbolic
  & typeof whenUnary & typeof whenFactorial
  & typeof whenBase

export const componentize: ComponentizeFn = multi(
  method(Real, whenReal),
  method(Complex, whenComplex),
  method(Variable, whenVariable),

  method(Addition, whenAddition),
  method(Multiplication, whenMultiplication),
  method(Exponentiation, whenExponentiation),
  method(Logarithm, whenLogarithm),

  method(Trigonometric, whenTrigonometric),
  method(Arcus, whenArcus),
  method(Hyperbolic, whenHyperbolic),
  method(AreaHyperbolic, whenAreaHyperbolic),
  method(Factorial, whenFactorial),
  method(Unary, whenUnary),

  method(Base, whenBase)
)

export type ExpressionProps = {
  node: Base
}

export type ExpressionComponent = (props: ExpressionProps) => JSX.Element

export const Expression: ExpressionComponent = (props) =>
  componentize(props.node)
