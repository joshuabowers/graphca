import React from 'react'
import { method, multi, Multi } from '@arrows/multimethod'
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

type when<T> = (expression: T) => JSX.Element

const whenReal: when<Real> = e => 
  <span className={[styles.constant, styles.real].join(' ')}>
    {e.value}
  </span>

const whenComplex: when<Complex> = e => 
  <span className={[styles.constant, styles.complex].join(' ')}>
    {e.a} + {e.b}{Unicode.i}
  </span>

const whenVariable: when<Variable> = e => 
  <span className={styles.variable}>
    {e.name}
  </span>


// const a = node.a.accept(this), b = node.b.accept(this)
// const op = node.operators[0]
// return (
//   <span className={[styles.binary, styles[className]].join(' ')}>
//     {this.parenthesize(node, node.a, a)}
//     <span className={styles.operator}>{op}</span>
//     {this.parenthesize(node, node.b, b)}
//   </span>
// )


// const createBinary = <T extends Binary>(metaClass: string, whenBasic: string, whenInverse: string): when<T> =>
//   (node: T) => {
//     const l = <Expression node={node.left} />,
//       r = <Expression node={node.right} />
//     return (
//       <span className={[styles.binary, styles[metaClass]].join(' ')}>
//         {l}
//         <span className={styles.operator}>{operator}</span>
//         {r}
//       </span>  
//     )
//   }

const whenAddition: when<Addition> = e => {
  // Consider ordering l and r based on which is negative.
  // i.e., l === -x, r === 5 => 5 - x, but
  // l === x, r === -5 => x - 5.
  // Would minimize negations
  // Further complication: if r is negative, the rendered expression needs
  // to be the negation of that. 
  const l = <Expression node={e.left} />,
    r = <Expression node={e.right} />
  const operator = isNegative(e.right) ? Unicode.minus : '+'
  return (
    <span className={[styles.binary, styles.addition].join(' ')}>
      {l}
      <span className={styles.operator}>{operator}</span>
      {r}
    </span>  
  )
}

const whenMultiplication: when<Multiplication> = e => <span></span>

const whenExponentiation: when<Exponentiation> = e => <span></span>
const whenLogarithm: when<Logarithm> = e => <span></span>

// const whenAddition = createBinary<Addition>('addition', '+', Unicode.minus)
// const whenMultiplication = createBinary<Multiplication>('multiplication', Unicode.multiplication, Unicode.division)

const createUnary = <T extends Unary>(metaClass: string, fnNames: FnNameFn<T>): when<T> =>
  (node: T) =>
    <span className={[styles.functional, styles[metaClass]].join(' ')}>
      {fnNames(node)}(<Expression node={node.expression}/>)
    </span>

const whenTrigonometric = createUnary('trigonometric', trigonometric)
const whenArcus = createUnary('arcus', arcus)
const whenHyperbolic = createUnary('hyperbolic', hyperbolic)
const whenAreaHyperbolic = createUnary('areaHyperbolic', areaHyperbolic)
const whenUnary = createUnary('unary', unary)

const whenBase: when<Base> = e => <span className={styles.unhandled}>Unhandled: {e.$kind}</span>

export type ComponentizeFn = Multi
  & typeof whenReal & typeof whenComplex & typeof whenVariable
  & typeof whenAddition & typeof whenMultiplication 
  & typeof whenExponentiation & typeof whenLogarithm
  & typeof whenTrigonometric & typeof whenArcus
  & typeof whenHyperbolic & typeof whenAreaHyperbolic
  & typeof whenUnary
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
  method(Unary, whenUnary),

  method(Base, whenBase)
)

export type ExpressionProps = {
  node: Base
}

export type ExpressionComponent = (props: ExpressionProps) => JSX.Element

export const Expression: ExpressionComponent = (props) =>
  componentize(props.node)
