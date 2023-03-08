import { fromMulti, method, multi, Multi, _ } from '@arrows/multimethod'
import { Writer, writer } from '../monads/writer'
import { 
  Particle, Operation, interleave
} from '../utility/operation'
import { 
  TreeNode, Clades, Genera, Species,
  isClade, isSpecies, TreeNodeGuardFn, isTreeNode
} from '../utility/tree'
import { processLogs, LogFunctionalFn } from '../utility/processLogs'
import {
  Real, Complex, Boolean, NaN,
  real, complex, boolean, nan, 
  isPrimitive, 
  isReal, isComplex, isBoolean, isNil, isNaN, isComplexInfinity
} from '../primitives'
import { variable } from '../variable'
import { Exponentiation, isExponentiation, raise } from '../arithmetic'
import { deepEquals } from '../utility/deepEquals'

export type MultiaryNode = TreeNode & {
  readonly clade: Clades.multiary,
  readonly operands: Writer<TreeNode, Operation>[]
}

export type Multiary<S extends Species, G extends Genera> = MultiaryNode & {
  readonly genus: G,
  readonly species: S
}

export const isMultiary = isClade<MultiaryNode>(Clades.multiary)

export type OperandPredicate<T> = 
  | ((t: Writer<T, Operation>) => boolean)
  | typeof _

export type Predicate<T> = 
  | ((operands: Writer<unknown, Operation>[]) => operands is Writer<T, Operation>[])
  | ((operands: Writer<TreeNode, Operation>[]) => boolean)
  | OperandPredicate<T>[]

export type Action<T> = [T|Writer<T, Operation>, string|undefined]

export type CorrespondingFn<T> =
  | ((...operands: Writer<T, Operation>[]) => Action<TreeNode>)
  | Action<TreeNode>

export const when = <T extends TreeNode>(
  predicate: Predicate<T>|undefined,
  fn: CorrespondingFn<T>
) =>
  (logFunctional: LogFunctionalFn) => {
    const handle = (...operands: Writer<T, Operation>[]) => {
      const [result, action] = typeof fn === 'function' ? fn(...operands) : fn
      return action 
        ? writer(result, ...logFunctional(action, ...operands))
        : result
    }
    return predicate ? method(predicate, handle) : method(handle)
  }

export type WhenFn = ReturnType<typeof when>

export type Handle<I, O extends TreeNode> = 
  (...params: I[]) => Writer<O, Operation>

export const walk = <T extends MultiaryNode>(guardFn: TreeNodeGuardFn<T>) =>
  function *cleave(node: Writer<TreeNode, Operation>): IterableIterator<Writer<TreeNode, Operation>>{
    if(guardFn(node)){
      for(let operand of node.value.operands){
        yield *cleave(operand)
      }
    } else {
      yield node
    }
  }

export type WalkCleaveFn = ReturnType<typeof walk>

export type CaseFn<T, R = T> = 
  (...params: Writer<T, Operation>[]) => Writer<R, Operation>

export type MultiaryFn<T> = Multi
  & CaseFn<Real>
  & CaseFn<Complex>
  & CaseFn<Boolean>
  & CaseFn<Real|Complex, Complex>
  & CaseFn<Boolean|Complex, Complex>
  & CaseFn<Boolean|Real, Real>
  & CaseFn<Real|Complex|Boolean, Complex>
  & CaseFn<NaN|Real|Complex|Boolean, NaN>
  & CaseFn<TreeNode, T>

export type MultiaryCreateFn<T extends MultiaryNode> =
  (...operands: Writer<TreeNode, Operation>[]) => Action<T>

export type MultiaryNodeMetaTuple<T extends MultiaryNode> = [
  MultiaryFn<T>,
  TreeNodeGuardFn<T>,
  MultiaryCreateFn<T>
]

export const matchGuard = <T extends TreeNode>(guard: TreeNodeGuardFn<T>) =>
  (params: Writer<unknown, Operation>[]): params is Writer<T, Operation>[] =>
    params.every(p => isTreeNode(p) && guard(p))

export const areReal = matchGuard(isReal),
  areComplex = matchGuard(isComplex),
  areBoolean = matchGuard(isBoolean)

export type ToRawFn<I extends TreeNode, M> =
  (value: Writer<I, Operation>) => M

type GenerateFn = Multi
  & ((p: Writer<TreeNode, Operation>, rest: Writer<TreeNode, Operation>[]) => Action<TreeNode>)


export const multiary = <T extends MultiaryNode>(
  name: string, species: Species, genus: Genera
) => {
  const create: MultiaryCreateFn<T> = (...operands) => {
    const n = ({clade: Clades.multiary, species, genus, operands}) as T
    return [n, `created ${species.toLocaleLowerCase()}`]
  }
  const guard = isSpecies<T>(species)
  const cleave = walk(guard)

  const toParticles = (...operands: Particle[][]): Particle[] =>
    ['(', ...interleave(operands, name), ')']
  const logFunctional = processLogs(toParticles, species)

  const handled = <I extends TreeNode, M, O extends TreeNode>(
    map: ToRawFn<I, M>, fn: Handle<M, O>, kind: Species
  ) =>
    (...params: Writer<I, Operation>[]): Action<O> => {
      const result = fn(...params.map(map))
      return [
        result,
        `${kind} ${species}`.toLocaleLowerCase()
      ]
    }

  return (
    whenReal: Handle<number, Real>,
    whenComplex: Handle<[number, number], Complex>,
    whenBoolean: Handle<boolean, Boolean>
  ) => {
    return (...replacements: ReplaceFn[]) => {
      const generate: GenerateFn = multi(
        (p: Writer<TreeNode, Operation>, _rest: Writer<TreeNode, Operation>[]) => p,
        replace(
          p => (isReal(p) 
            && !Number.isFinite(p.value.raw) 
            && !Number.isNaN(p.value.raw))
            || (isComplex(p) && isComplexInfinity(p)),
          (p, _rest) => [[p], 'infinite absorption']
        )(create),
        replace(
          p => isNaN(p) || isNil(p),
          (p, _rest) => [[p], 'incalculable']
        )(create),
        ...replacements.map(r => r(create)),
        replace(_p => true, (p, rest) => [[p, ...rest], undefined])(create)
      )
      return (...considerations: ConsiderFn[]): MultiaryNodeMetaTuple<T> => {
        const combineTerms = createCombineTerms(logFunctional, ...considerations)
        const fn: MultiaryFn<T> = multi(
          // Insert other edge cases here
          when(
            (operands: Writer<TreeNode, Operation>[]) =>
              operands.some(isComplex) && operands.every(isPrimitive),
            (...operands) => [fn(
              ...operands.filter(isComplex), 
              ...operands.filter(o => isPrimitive(o) && !isComplex(o)).map(
                o => isReal(o) ? complex(o) : isBoolean(o) ? complex(o) : nan
              )
            ), 'cast non-complex operands to complex']
          ),
          when(
            (operands: Writer<TreeNode, Operation>[]) =>
              operands.some(isReal) && operands.every(isPrimitive),
            (...operands) => [fn(
              ...operands.filter(isReal),
              ...operands.filter(o => isPrimitive(o) && !isReal(o)).map(
                o => isBoolean(o) ? real(o) : nan
              )
            ), 'cast non-real operands to real']
          ),
          when(
            (operands: Writer<TreeNode, Operation>[]) =>
              operands.some(o => isNil(o) || isNaN(o)),
            [nan, 'not a number']
          ),
          when(
            areReal, 
            handled(r => r.value.raw, whenReal, Species.real)
          ),
          when(
            areComplex, 
            handled(
              ({value: {raw: {a, b}}}) => [a, b] as [number, number], 
              whenComplex, Species.complex
            )
          ),
          when(
            areBoolean, 
            handled(b => b.value.raw, whenBoolean, Species.boolean)
          ),
          when(
            undefined,
            (...initialOperands: Writer<TreeNode, Operation>[]) => {
              let operands = combineTerms(
                initialOperands.flatMap(n => [...cleave(n)])
              )
              const primitives = operands.filter(isPrimitive)
              if(primitives.length > 0){
                operands = [fn(...primitives), ...operands.filter(m => !isPrimitive(m))]
              }
              return generate(operands[0], operands.slice(1))
            }
          )
        )
        return [fn, guard, create]
      }
    }
  }
}

/**
 * Performs the difference of the two passed arrays, looking only at
 * the exact memory objects. Should handle arrays with duplicate objects.
 * Adapted from: https://stackoverflow.com/a/30288946
 * @param a 
 * @param b 
 * @returns 
 */
const difference = <T>(a: T[], b: T[]) => {
  const s = new Set(b)
  return a.filter(i => !s.has(i))
}

type CombineTermsPredicateFn<M extends TreeNode, N extends TreeNode> = 
  ((m: Writer<M, Operation>, n: Writer<N, Operation>) => boolean)
type CombineTermsCorrespondingFn<M extends TreeNode, N extends TreeNode> =
  ((m: Writer<M, Operation>, copies: Writer<N, Operation>[]) => Action<TreeNode>)

const createCombineTerms = (
  logFunctional: LogFunctionalFn, ...caseFns: ConsiderFn[]
) => {
  const considerations = caseFns.map(c => c(logFunctional))
  return (initialOperands: Writer<TreeNode, Operation>[]) => {
    const unchecked = [...initialOperands]
    let operands = [...initialOperands]

    while(unchecked.length > 0){
      const m = unchecked.shift()
      if(!m){ break; }

      for(let consideration of considerations){
        const [result, consumed] = consideration(m, operands)
        if(result && consumed){
          unchecked.push(result)
          operands = [...difference(operands, consumed), result]
          break;
        }
      }
    }

    return operands
  }
}

type AlterationsTuple = [undefined, undefined] |
  [Writer<TreeNode, Operation>, Writer<TreeNode, Operation>[]]

type ConsiderationExecFn = (
  m: Writer<TreeNode, Operation>, 
  operands: Writer<TreeNode, Operation>[]
) => AlterationsTuple

const consider = <M extends TreeNode, N extends TreeNode>(
  predicate: CombineTermsPredicateFn<TreeNode, N>,
  correspondingFn: CombineTermsCorrespondingFn<M, N>
) => (logFunctional: LogFunctionalFn): ConsiderationExecFn =>
  (m, operands) => {
    // NOTE: `m` may exist in `operands`, but `copies` should not have a
    // duplicate of that value; hence `m !== n`, to filter that edge case.
    // As `!==` does reference equality for objects, that should suffice.
    const copies = operands.filter(
      n => m !== n && predicate(m, n as Writer<N, Operation>)
    )
    if(copies.length > 0){
      const [result, action] = correspondingFn(
        m as Writer<M, Operation>, copies as Writer<N, Operation>[]
      )
      if(!action){ throw new Error('`consider`: undefined `action` for given result') }
      return [
        writer(result, ...logFunctional(action, m, ...copies)), 
        [m, ...copies]
      ]
    }
    return [undefined, undefined]
  }

type ConsiderFn = ReturnType<typeof consider>

const replace = <T extends MultiaryNode>(
  predicate: ((p: Writer<TreeNode, Operation>) => boolean),
  correspondingFn: ((p: Writer<TreeNode, Operation>, rest: Writer<TreeNode, Operation>[]) => [Writer<TreeNode, Operation>[], string|undefined])
) => 
  (create: MultiaryCreateFn<T>) =>
    method(predicate, (p: Writer<TreeNode, Operation>, rest: Writer<TreeNode, Operation>[]): Action<TreeNode> => {
      const [operands, action] = correspondingFn(p, rest)
      if(operands.length > 1){
        const [result, defaultAction] = create(...operands)
        return [result, action ?? defaultAction]
      } else {
        return [operands[0], 'reduced to singular operand']
      }
    })

type ReplaceFn = ReturnType<typeof replace>

type Addition = Multiary<Species.add, Genera.arithmetic>
const [add, isAddition, $add] = multiary<Addition>(
  '+', Species.add, Genera.arithmetic
)(
  (...addends) => real(addends.reduce((p,c) => p+c)),
  (...addends) => complex(...addends.reduce((p,c) => [p[0]+c[0], p[1]+c[1]])),
  (...addends) => boolean(addends.reduce((p,c) => (p || c) && !(p && c)))
)(
  replace(
    p => (isReal(p) && p.value.raw === 0)
      || (isComplex(p) && p.value.raw.a === 0 && p.value.raw.b === 0),
    (_p, rest) => [rest, 'additive identity']
  )  
)(
  // 1st: deepEquals between a and all other addends.
  // => Ex.: x + x + x => 3 * x
  consider(
    deepEquals,
    (a, copies) => [
      multiply(a, real(1 + copies.length)), 
      'combine equivalent sub-expressions'
    ]
  ),
  // 2nd: deepEquals between `a` and multiplication addends multiplicands
  // => Ex.: x + 2*x => 3*x
  consider<TreeNode, Multiplication>(
    (a, b) => isMultiplication(b) && b.value.operands.some(m => deepEquals(a, m)),
    (a, copies) => [
      multiply(a, add(real(1), ...copies.map(b => multiply(...b.value.operands.filter(m => deepEquals(a, m)))))),
      'factor common sub-expression'
    ]
  ),
  // TODO: Need more thought on what these need to be doing.
  // 3rd: deepEquals between multiplication `a` multiplicands and other addends
  // => Ex.: 2*x + x => 3*x
  // consider<Multiplication, TreeNode>(
  //   (a, b) => isMultiplication(a) && a.value.operands.some(m => deepEquals(m, b)),
  //   (a, copies) => [
  //     multiply(a, add(multiply(a.value.operands.filter()), real(copies.length)))
  //   ]
  // ),
  // 4th: deepEquals between multiplication addends multiplicands
  // => Ex.: 2*x + 3*x => 5*x
  // consider<Multiplication, Multiplication>()
)

type Multiplication = Multiary<Species.multiply, Genera.arithmetic>
const [multiply, isMultiplication, $multiply] = multiary<Multiplication>(
  '*', Species.multiply, Genera.arithmetic
)(
  // Primitive Handler block
  (...operands) => real(operands.reduce((p,c) => p*c)),
  (...operands) => complex(...operands.reduce(
    (p,c) => [
      (p[0]*c[0]) - (p[1]*c[1]),
      (p[0]*c[1]) + (p[1]*c[0])
    ]
  )),
  (...operands) => boolean(operands.reduce((p,c) => p && c))
)(
  replace(
    p => (isReal(p) && p.value.raw === 0)
      || (isComplex(p) && p.value.raw.a === 0 && p.value.raw.b === 0),
    (p, _rest) => [[p], 'zero absorption']
  ),
  replace(
    p => (isReal(p) && p.value.raw === 1)
      || (isComplex(p) && p.value.raw.a === 1 && p.value.raw.b === 0),
    (_p, rest) => [rest, 'multiplicative identity']
  )
)(
  // 1st: deepEquals between m and all other multiplicands.
  // => Ex.: x * x * x => x^3
  consider(
    deepEquals,
    (m, copies) => [
      raise(m, real(1 + copies.length)), 
      'combine equivalent sub-expressions'
    ]
  ),
  // 2nd: deepEquals between m and exponentiation multiplicands bases.
  // => Ex.: x * x^2 => x^3
  consider<TreeNode, Exponentiation>(
    (m, n) => isExponentiation(n) && deepEquals(m, n.value.left),
    (m, copies) => [
      raise(m, add(real(1), ...copies.map(n => n.value.right))), 
      'combine sub-expressions where one is the base of other exponentiations'
    ]
  ),
  // 3rd: isExponentiation(m) and deepEquals m base with other multiplicands.
  // => Ex.: x^2 * x => x^3
  consider<Exponentiation, TreeNode>(
    (m, n) => isExponentiation(m) && deepEquals(m.value.left, n),
    (m, copies) => [
      raise(m.value.left, add(m.value.right, real(copies.length))), 
      'combine sub-expressions where the base of an exponentiation equals other operands'
    ]
  ),
  // 4th: isExponentiation(m) and deepEquals m base with other exponentiation bases.
  // => Ex.: x^2 * x^3 => x^5
  consider<Exponentiation, Exponentiation>(
    (m, n) => isExponentiation(m) && isExponentiation(n) && deepEquals(m.value.left, n.value.right),
    (m, copies) => [
      raise(m.value.left, add(m.value.right, ...copies.map(n => n.value.right))), 
      'combine sub-expression exponentiations which have equivalent bases'
    ]
  )
)

multiply(real(5), real(10))
multiply(complex(1, 2), real(5))
multiply(boolean(true), real(3))
multiply(real(5), variable('x'))
multiply(real(2), real(3), real(4), real(5))
multiply(real(5), nan)
