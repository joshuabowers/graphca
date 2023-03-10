import { method, multi, Multi, _ } from '@arrows/multimethod'
import { Writer, writer } from '../monads/writer'
import { 
  Particle, Operation, interleave
} from '../utility/operation'
import { 
  TreeNode, Clades, Genera, Species, SortOrder,
  isClade, isSpecies, TreeNodeGuardFn, isTreeNode
} from '../utility/tree'
import { processLogs, LogFunctionalFn } from '../utility/processLogs'
import { UnaryFn } from './unary'
import { BinaryFn } from './binary'
import {
  Real, Complex, Boolean, NaN,
  real, complex, boolean, nan, 
  isPrimitive, 
  isReal, isComplex, isBoolean, isNil, isNaN, isComplexInfinity
} from '../primitives'
import { degree } from '../arithmetic/degree'

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
  // | ((operands: Writer<unknown, Operation>[]) => operands is Writer<T, Operation>[])
  | ((...operands: Writer<TreeNode, Operation>[]) => boolean)
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

export type SortMutateFn<T> = (t: T) => number

/**
 * Sorts data by first converting each item via mutate; the mutated values
 * are sorted by ascending order by default, but can be changed by order.
 * @param data An array to sort; values are passed to mutate
 * @param mutate A function which produces a comparable value
 * @param order A value indicating sort direction
 * @returns data sorted by the results of mutate
 */
export const sortBy = <T>(
  data: T[], 
  mutate: SortMutateFn<T>, 
  order: SortOrder = SortOrder.ascending
): T[] => {
  const mapped = data.map((v, i) => ({i, value: mutate(v)}))
  type Item = (typeof mapped)[number]
  const comparator = order === SortOrder.ascending 
    ? (a: Item, b: Item) => b.value - a.value
    : (a: Item, b: Item) => a.value - b.value
    
  mapped.sort(comparator)

  return mapped.map(v => data[v.i])
}

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

// export const matchGuard = <T extends TreeNode>(guard: TreeNodeGuardFn<T>) =>
//   (params: Writer<unknown, Operation>[]): params is Writer<T, Operation>[] =>
//     params.every(p => isTreeNode(p) && guard(p))

export const matchGuard = <T extends TreeNode>(guard: TreeNodeGuardFn<T>) =>
  (...params: Writer<unknown, Operation>[]) =>
    params.every(p => isTreeNode(p) && guard(p))

export const areReal = matchGuard(isReal),
  areComplex = matchGuard(isComplex),
  areBoolean = matchGuard(isBoolean)

export type ToRawFn<I extends TreeNode, M> =
  (value: Writer<I, Operation>) => M

type GenerateFn = Multi
  & ((p: Writer<TreeNode, Operation>, rest: Writer<TreeNode, Operation>[]) => Action<TreeNode>)

export const multiary = <T extends MultiaryNode>(
  name: string, species: Species, genus: Genera, 
  // sortMutate: SortMutateFn<Writer<TreeNode, Operation>>, 
  sortOrder: SortOrder
) => {
  const create: MultiaryCreateFn<T> = (...operands) => {
    // const sorted = sortBy(operands, sortMutate, sortOrder)
    const sorted = operands
    const n = ({clade: Clades.multiary, species, genus, operands: sorted}) as T
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
            (...operands: Writer<TreeNode, Operation>[]) =>
              operands.some(isComplex) 
              && operands.some(v => isReal(v) || isBoolean(v))
              && operands.every(isPrimitive),
            (...operands) => [fn(
              ...operands.filter(isComplex), 
              ...operands.filter(o => isPrimitive(o) && !isComplex(o)).map(
                o => isReal(o) ? complex(o) : isBoolean(o) ? complex(o) : nan
              )
            ), 'cast non-complex operands to complex']
          )(logFunctional),
          when(
            (...operands: Writer<TreeNode, Operation>[]) =>
              operands.some(isReal) 
              && operands.some(isBoolean) 
              && operands.every(isPrimitive),
            (...operands) => [fn(
              ...operands.filter(isReal),
              ...operands.filter(o => isPrimitive(o) && !isReal(o)).map(
                o => isBoolean(o) ? real(o) : nan
              )
            ), 'cast non-real operands to real']
          )(logFunctional),
          when(
            (...operands: Writer<TreeNode, Operation>[]) =>
              operands.some(o => isNil(o) || isNaN(o)),
            [nan, 'not a number']
          )(logFunctional),
          when<Real>(
            areReal, 
            handled(r => r.value.raw, whenReal, Species.real)
          )(logFunctional),
          when<Complex>(
            areComplex, 
            handled(
              ({value: {raw: {a, b}}}) => [a, b] as [number, number], 
              whenComplex, Species.complex
            )
          )(logFunctional),
          when<Boolean>(
            areBoolean, 
            handled(b => b.value.raw, whenBoolean, Species.boolean)
          )(logFunctional),
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
          )(logFunctional)
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

export const consider = <M extends TreeNode, N extends TreeNode>(
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

export const replace = <T extends MultiaryNode>(
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

/**
 * Generates a new unary function from a multiary function. MultiaryNode's
 * created from the unary closure will have 'boundOperands' inserted into
 * their operands array alongside their singular argument.
 * @param fn a basis multiary fn to derive from
 * @returns a unary function which generates the multiary with boundOperands
 */
export const unaryFrom = <T extends MultiaryNode>(fn: MultiaryFn<T>) =>
  (...boundOperands: Writer<TreeNode, Operation>[]): UnaryFn<T> =>
    multi(
      method(
        (e: Writer<TreeNode, Operation>) => fn(...boundOperands, e)
      )
    )

export type OperandMapFn = 
  undefined | ((n: Writer<TreeNode, Operation>) => Writer<TreeNode, Operation>)

/**
 * Generates a new binary function from a multiary function. MultiaryNode's
 * create from the binary closure will have their two operands passed through
 * the left and right map functions, should those be present.
 * @param fn a basis multiary fn to derive from
 * @returns a binary function which maps its arguments
 */
export const binaryFrom = <T extends MultiaryNode>(fn: MultiaryFn<T>) =>
  (leftMapFn: OperandMapFn, rightMapFn: OperandMapFn): BinaryFn<T> =>
    multi(
      method(
        (l: Writer<TreeNode, Operation>, r: Writer<TreeNode, Operation>) =>
          fn(leftMapFn?.(l) ?? l, rightMapFn?.(r) ?? r)
      )
    )
