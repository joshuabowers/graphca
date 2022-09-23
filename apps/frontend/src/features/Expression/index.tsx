// type FnNameFn<T extends UnaryNode> = Multi & ((node: W.Writer<T>) => string)

// const trigonometric: FnNameFn<TrigonometricNode> = multi(
//   method(isCosine, 'cos'),
//   method(isSine, 'sin'),
//   method(isTangent, 'tan'),
//   method(isSecant, 'sec'),
//   method(isCosecant, 'csc'),
//   method(isCotangent, 'cot')
// )

// const arcus: FnNameFn<ArcusNode> = multi(
//   method(isArcusCosine, 'acos'),
//   method(isArcusSine, 'asin'),
//   method(isArcusTangent, 'atan'),
//   method(isArcusSecant, 'asec'),
//   method(isArcusCosecant, 'acsc'),
//   method(isArcusCotangent, 'acot'),
// )

// const hyperbolic: FnNameFn<HyperbolicNode> = multi(
//   method(isHyperbolicCosine, 'cosh'),
//   method(isHyperbolicSine, 'sinh'),
//   method(isHyperbolicTangent, 'tanh'),
//   method(isHyperbolicSecant, 'sech'),
//   method(isHyperbolicCosecant, 'csch'),
//   method(isHyperbolicCotangent, 'coth'),
// )

// const areaHyperbolic: FnNameFn<AreaHyperbolicNode> = multi(
//   method(isAreaHyperbolicCosine, 'acosh'),
//   method(isAreaHyperbolicSine, 'asinh'),
//   method(isAreaHyperbolicTangent, 'atanh'),
//   method(isAreaHyperbolicSecant, 'asech'),
//   method(isAreaHyperbolicCosecant, 'acsch'),
//   method(isAreaHyperbolicCotangent, 'acoth'),
// )

// const unary: FnNameFn<UnaryNode> = multi(
//   method(isAbsolute, 'abs'),
//   method(isGamma, Unicode.gamma)
// )





// type when<T> = (expression: T) => JSX.Element


// const createUnary = <T extends Unary>(metaClass: string, fnNames: FnNameFn<T>): when<T> =>
//   (node: T) =>
//     <span className={[styles.functional, styles[metaClass]].join(' ')}>
//       {fnNames(node)}({componentize(node.expression)})
//     </span>

// const whenTrigonometric = createUnary('trigonometric', trigonometric)
// const whenArcus = createUnary('arcus', arcus)
// const whenHyperbolic = createUnary('hyperbolic', hyperbolic)
// const whenAreaHyperbolic = createUnary('areaHyperbolic', areaHyperbolic)
// const whenUnary = createUnary('unary', unary)



import styles from './Expression.module.css'
import { multi, method, Multi } from "@arrows/multimethod"
import { BinaryNode, isBinary } from '@bowers/calcula/src/closures/binary'
import { 
  Unicode, TreeNode, W, isTreeNode, TreeNodeGuardFn, Species, notAny,
  real, multiply, reciprocal, negate, isValue,
  isReal, isComplex, isBoolean, isNil, isNaN, isVariable, 
  isAddition, isMultiplication, isExponentiation, isLogarithm, 
  isEquality, isStrictInequality, isLessThan, isGreaterThan, 
  isLessThanEquals, isGreaterThanEquals, isComplement, 
  isConjunction, isDisjunction, isExclusiveDisjunction, isImplication,
  isAlternativeDenial, isJointDenial, isBiconditional, isConverseImplication, 
  isPermutation, isCombination, isFactorial, isPolygamma
} from "@bowers/calcula"

type AsComponent<T extends TreeNode> = (expression: T) => JSX.Element
type AsBoolean<T extends TreeNode> = (expression: T) => boolean
type ComponentizeFn = Multi & ((expression: W.Writer<TreeNode>) => JSX.Element)

const when = <T extends TreeNode>(
  guard: TreeNodeGuardFn<T>, fn: AsComponent<T> | AsBoolean<T>
) => method(guard, (e: W.Writer<T>) => fn(e.value))

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

const identity = (n: JSX.Element) => n
const wrap = (n: JSX.Element) => <>({n})</>

type ParenthesizeFn = Multi
  & ((node: W.Writer<BinaryNode>, child: W.Writer<TreeNode>) => 
    (component: JSX.Element) => JSX.Element)

const parenthesize: ParenthesizeFn = multi(
  method([isMultiplication, isAddition], () => wrap),
  method([isMultiplication, isMultiplication], () => wrap),
  method([isExponentiation, notAny(Species.real, Species.variable)], () => wrap),
  method(() => identity)
)

type NumericPredicateFn = Multi & ((expression: W.Writer<TreeNode>) => boolean)

const isNegative: NumericPredicateFn = multi(
  when(isReal, e => e.value < 0),
  when(isMultiplication, e => isNegative(e.left) || isNegative(e.right)),
  method(false)
)

const isReciprocal: NumericPredicateFn = multi(
  when(isExponentiation, e => isNegative(e.right)),
  method(false)
)

type LogarithmNameFn = Multi & ((base: W.Writer<TreeNode>) => string)

const logarithm: LogarithmNameFn = multi(
  method(isValue(real(2)), 'lb'),
  method(isValue(real(Math.E)), 'ln'),
  method(isValue(real(10)), 'lg'),
  method('log')
)

const asConstant = (className: string, value: JSX.Element|string) =>
  <span className={[styles.constant, className].join(' ')}>{value}</span>

const asBinary = (className: string, operator: string, l: JSX.Element, r: JSX.Element) => (
  <span className={[styles.binary, styles[className]].join(' ')}>
    {l}
    <span className={styles.operator}>{operator}</span>
    {r}
  </span>
)

const asCombinatorial = (fnName: string) =>
  (node: BinaryNode) => {
    const l = componentize(node.left), r = componentize(node.right)
    return <span className={[styles.functional, styles.combinatorial].join(' ')}>
      {fnName}({l}, {r})
    </span>
  }

const createLogicalBinary = (className: string) =>
  <T extends BinaryNode>(operator: string) =>
    (expression: T) => {
      const l = componentize(expression.left), r = componentize(expression.right)
      return asBinary(className, operator, l, r)  
    }

const asInequality = createLogicalBinary('inequality')
const asConnective = createLogicalBinary('connective')

const componentize: ComponentizeFn = multi(
  // Primitives
  when(isReal, e => asConstant(styles.real, symbolic(e.value))),
  when(
    isComplex, 
    e => asConstant(styles.complex, stringifyComplex(e.a, e.b))
  ),
  when(isBoolean, e => asConstant(styles.boolean, e.value.toString())),
  when(isNil, _ => asConstant(styles.nil, 'nil')),
  when(isNaN, _ => asConstant(styles.nan, 'nan')),

  when(
    isVariable,
    e => (
      !isNil(e.value)
        ? componentize(e.value)
        : <span className={styles.variable}>
            {e.name}
          </span>
    )
  ),

  // arithmetic
  when(
    isAddition,
    e => {
      const lNegative = isNegative(e.left), rNegative = isNegative(e.right)
      const either = lNegative || rNegative, lExclusive = lNegative && !rNegative
      const left = lExclusive ? e.right : e.left, 
        right = lExclusive ? e.left : e.right
      const l = componentize(left), 
        r = componentize(either ? negate(right) : right)
      const className = either ? 'subtraction' : 'addition'
      const operator = either ? Unicode.minus : '+'
      return asBinary(
        className, operator, 
        parenthesize(W.unit(e), left)(l), 
        parenthesize(W.unit(e), right)(r)
      )
    }
  ),
  when(
    isMultiplication,
    e => {
      const lReciprocal = isReciprocal(e.left), rReciprocal = isReciprocal(e.right)
      const either = lReciprocal || rReciprocal, lExclusive = lReciprocal && !rReciprocal
      const both = lReciprocal && rReciprocal
      const reorderLeft = lExclusive ? e.right : e.left,
        reorderRight = lExclusive ? e.left : e.right
      const left = both ? real(1) : reorderLeft,
        right = both ? multiply(reciprocal(reorderLeft), reciprocal(reorderRight)) : (
          rReciprocal ? reciprocal(reorderRight) : reorderRight
        )
      // const lNegative = left instanceof Real && left.value === -1
      const lNegative = isNegative(left)
      const l = componentize(left), r = componentize(right)
      const className = either ? 'division' : (lNegative ? 'negation' : 'multiplication')
      const operator = either ? Unicode.division : (lNegative ? Unicode.minus : Unicode.multiplication)
      return asBinary(
        className, operator, 
        className === 'negation' ? <></> : parenthesize(W.unit(e), left)(l), 
        parenthesize(W.unit(e), right)(r)
      )
    }
  ),
  when(
    isExponentiation,
    e => {
      const l = componentize(e.left), r = componentize(e.right)
      return asBinary(
        'exponentiation', '^', 
        parenthesize(W.unit(e), e.left)(l), parenthesize(W.unit(e), e.right)(r)
      )
    }
  ),

  // functions
  when(
    isLogarithm,
    e => {
      const functionName = logarithm(e.left)
      const base = functionName === 'log' ? componentize(e.left) : <></>
      return <span className={[styles.functional, styles.logarithmic].join(' ')}>
        {functionName}<span className={styles.sub}>{base}</span>({componentize(e.right)})
      </span>
    }
  ),

  when(isPermutation, asCombinatorial('P')),
  when(isCombination, asCombinatorial('C')),

  when(isEquality, asInequality('==')),
  when(isStrictInequality, asInequality('!=')),
  when(isLessThan, asInequality('<')),
  when(isGreaterThan, asInequality('>')),
  when(isLessThanEquals, asInequality('<=')),
  when(isGreaterThanEquals, asInequality('>=')),

  when(isConjunction, asConnective('/\\')),
  when(isDisjunction, asConnective('\\/')),
  when(isExclusiveDisjunction, asConnective(Unicode.xor)),
  when(isImplication, asConnective('->')),
  when(isAlternativeDenial, asConnective(Unicode.nand)),
  when(isJointDenial, asConnective(Unicode.nor)),
  when(isBiconditional, asConnective('<->')),
  when(isConverseImplication, asConnective('<-')),
  when(
    isComplement, 
    e => {
      const child = componentize(e.expression)
      const shouldWrap = isBinary(e.expression)
      return <span className={[styles.functional, styles.unary].join(' ')}>
        {Unicode.not}{shouldWrap ? <>({child})</> : child}
      </span>
    }
  ),

  when(
    isFactorial,
    e => {
      const child = componentize(e.expression)
      const shouldWrap = isBinary(e.expression)
      return <span className={styles.factorial}>
        {shouldWrap ? <>({child})</> : child}!
      </span>
    }
  ),

  when(
    isPolygamma,
    e => {
      const order = componentize(e.left)
      const expression = componentize(e.right)
      return <span className={[styles.functional, styles.polygamma].join(' ')}>
        {Unicode.digamma}<span className={styles.super}><span>({order})</span></span>({expression})
      </span>
    }
  ),

  // Fallback
  when(
    isTreeNode, 
    e => <span className={styles.unhandled}>Unhandled: {e.species}</span>
  )
)

export type ExpressionProps = {
  node: W.Writer<TreeNode>
}

export type ExpressionComponent = (props: ExpressionProps) => JSX.Element

export const Expression: ExpressionComponent = (props) =>
  componentize(props.node)
