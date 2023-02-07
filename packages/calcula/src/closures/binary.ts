import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, writer, curate } from "../monads/writer"
import { Particle, Operation, operation, context, Action } from "../utility/operation"
import { CaretPosition, embedCaret } from "../utility/caret"
import { CastFn } from "../utility/typings"
import { 
  TreeNode, Clades, Genera, Species, isClade, 
  eitherNilOrNaN, TreeNodeGuardFn, isSpecies, isTreeNode, Notation
} from "../utility/tree"
import { UnaryFn } from "./unary"
import { 
  Real, Complex, Boolean, Nil, NaN,
  isReal, isComplex, isBoolean,
  real, complex, nan
} from '../primitives'
// import { rule, Input, process, resolve } from "../utility/rule"

export type BinaryNode = TreeNode & {
  readonly clade: Clades.binary,
  readonly left: Writer<TreeNode, Operation>,
  readonly right: Writer<TreeNode, Operation>
}

export type Binary<S extends Species, G extends Genera|undefined = undefined> =
  BinaryNode & {
    readonly genus: G,
    readonly species: S,
  }

export const isBinary = isClade<BinaryNode>(Clades.binary)

export const identity = <T>(t: T) => t
export const leftChild = 
  <T extends BinaryNode>(t: Writer<T, Operation>) => t.value.left
export const rightChild = 
  <T extends BinaryNode>(t: Writer<T, Operation>) => t.value.right

type BinaryCaseFn<L, R = L, T = L> = (l: L, r: R) => Action<T>
type BinaryCastFn<L, R = L, T = L> = 
  (l: Writer<L, Operation>, r: Writer<R, Operation>) => Writer<T, Operation>

type Choose<D, F> = F extends void ? D : F

export type BinaryFn<T, R = void> = Multi
  & BinaryCastFn<Real, Real, Choose<Real, R>>
  & BinaryCastFn<Complex, Complex, Choose<Complex, R>>
  & BinaryCastFn<Boolean, Boolean, Choose<Boolean, R>>
  & BinaryCastFn<Real, Complex, Choose<Complex, R>>
  & BinaryCastFn<Complex, Real, Choose<Complex, R>>
  & BinaryCastFn<Real, Boolean, Choose<Real, R>>
  & BinaryCastFn<Boolean, Real, Choose<Real, R>>
  & BinaryCastFn<Complex, Boolean, Choose<Complex, R>>
  & BinaryCastFn<Boolean, Complex, Choose<Complex, R>>
  & BinaryCastFn<Nil|NaN, TreeNode, NaN>
  & BinaryCastFn<TreeNode, Nil|NaN, NaN>
  & BinaryCastFn<TreeNode, TreeNode, T>

type UnaryPredicate<L> = (t: Writer<L, Operation>) => boolean 
type BinaryPredicate<L, R> = (l: Writer<L, Operation>, r: Writer<R, Operation>) => boolean  
type Test<T> = UnaryPredicate<T> | Writer<T, Operation> | typeof _
type CorrespondingFn<L, R> = (l: Writer<L, Operation>, r: Writer<R, Operation>) => Action<TreeNode>  
export type BinaryCreateFn<T extends BinaryNode> = 
  (l: Writer<TreeNode, Operation>, r: Writer<TreeNode, Operation>) => Action<T>
// export type BinaryToString<L extends Input, R extends Input> = (l: L, r: R) => Rewrite
type ToParticlesFn = (
  position: CaretPosition, left: Particle[], right: Particle[]
) => Particle[]

export const when = <L extends TreeNode, R extends TreeNode>( 
  predicate: Test<L> | [Test<L>, Test<R>] | BinaryPredicate<L, R>, 
  fn: Action<TreeNode> | CorrespondingFn<L, R>
) => 
  (toParticles: ToParticlesFn, species: Species) => {
    return method(predicate, (l: Writer<L, Operation>, r: Writer<R, Operation>) => {
      const [result, action] = typeof fn === 'function' ? fn(curate(l), curate(r)) : fn
      return writer(
        result,
        // identified species
        operation(
          toParticles(CaretPosition.none, context(l, 0), context(r, 0)),
          `identified ${species.toLocaleLowerCase()}`
        ),
        // processing left
        operation(
          toParticles(CaretPosition.before, context(l, 0), context(r, 0)),
          'processing left operand'
        ),
        // left logs
        ...l.log,
        // replaces left, processing right
        operation(
          toParticles(CaretPosition.between, context(l, -1), context(r, 0)),
          'processed left operand; processing right operand'
        ),
        // right logs
        ...r.log,
        // replaces right
        operation(
          toParticles(CaretPosition.after, context(l, -1), context(r, -1)),
          'processed right operand'
        ),
        // action applied
        operation(          
          toParticles(CaretPosition.none, context(l, -1), context(r, -1)),
          action
        )
      )
    })
      // bind(l, x => 
      //   bind(r, y => {
      //     const [result, rewrite, action] = typeof fn === 'function' ? fn(x, y) : fn
      //     return ({
      //       value: isWriter(result) ? result.value : result,
      //       log: [
      //         {input: toString(x, y), rewrite, action},
      //         ...(isWriter(result) ? result.log : [])
      //       ]
      //     })
      //   })
      // ) 
  }

export type WhenFn = ReturnType<typeof when>
export type EdgeCaseFns = (when: WhenFn) => (typeof method)[]

const apply = <T, U>(fn: BinaryFn<T, U>) =>
  <L extends TreeNode, R extends TreeNode>(
    changeLeft: CastFn<Writer<L, Operation>, L|R>, 
    changeRight: CastFn<Writer<R, Operation>, L|R>
  ) =>
    (l: Writer<L, Operation>, r: Writer<R, Operation>) =>
      fn(changeLeft(l), changeRight(r))

export type BinaryNodeMetaTuple<T extends BinaryNode, R> = [
  BinaryFn<T, R>,
  TreeNodeGuardFn<T>,
  BinaryCreateFn<T>
]

// export const binaryInfixRule = (operator: string) =>
//   <L extends Input, R extends Input>(l: L, r: R) =>
//     process`${l} ${operator} ${r}`

// export const binaryFnRule = (fnName: string) =>
//   <L extends Input, R extends Input>(l: L, r: R) =>
//     process`${fnName}(${l}, ${r})`

export type Handle<I extends TreeNode, O extends TreeNode> = 
  (l: Writer<I, Operation>, r: Writer<I, Operation>) => Writer<O, Operation>

export const binary = <T extends BinaryNode, R = void>(
  name: string, notation: Notation, species: Species, genus?: Genera
) => {
  type Result<U extends TreeNode> = R extends void ? U : (R extends TreeNode ? R : never)
  const create = (left: Writer<TreeNode, Operation>, right: Writer<TreeNode, Operation>): Action<T> => {
    const n = ({clade: Clades.binary, species, genus, left, right}) as T
    return [n, `created ${species.toLocaleLowerCase()}`]
  }
  if(notation === Notation.postfix){ throw new Error(`Unknown binary postfix operation: ${name}`) }
  const toParticles: ToParticlesFn = (position, left, right) =>
    notation === Notation.prefix
      ? [name, '(', ...embedCaret(position, left, ',', right), ')']
      : ['(', ...embedCaret(position, left, name, right), ')']

  // const toString = notation === Notation.infix ? binaryInfixRule(name) : binaryFnRule(name)
  return (
    whenReal: Handle<Real, Result<Real>>,
    whenComplex: Handle<Complex, Result<Complex>>,
    whenBoolean: Handle<Boolean, Result<Boolean>>
  ) => {
    const handled = <V extends TreeNode, W extends TreeNode>(
      fn: Handle<V, W>, kind: Species
    ) => 
      (l: Writer<V, Operation>, r: Writer<V, Operation>): Action<W> => {
        const result = fn(l, r)
        return [
          result, 
          // process`${result}`, 
          `${kind.toLocaleLowerCase()} ${species.toLocaleLowerCase()}`
        ]
      }
    let fn: BinaryFn<T, R> = multi(
      when([isReal, isReal], handled(whenReal, Species.real))(toParticles, species),
      when([isComplex, isComplex], handled(whenComplex, Species.complex))(toParticles, species),
      when([isBoolean, isBoolean], handled(whenBoolean, Species.boolean))(toParticles, species),
      when<Nil|NaN, TreeNode>([eitherNilOrNaN, _], (_l, _r) => [nan, 'not a number'])(toParticles, species),
      when<TreeNode, Nil|NaN>([_, eitherNilOrNaN], (_l, _r) => [nan, 'not a number'])(toParticles, species),
      when([isTreeNode, isTreeNode], (l, r) => create(l, r))(toParticles, species)
    )
    return (...methods: WhenFn[]): BinaryNodeMetaTuple<T, R> => {
      fn = fromMulti(
        ...methods.map(m => m(toParticles, species)),
        method([isReal, isComplex], apply(fn)(complex, identity)),
        method([isComplex, isReal], apply(fn)(identity, complex)),
        method([isReal, isBoolean], apply(fn)(identity, real)),
        method([isBoolean, isReal], apply(fn)(real, identity)),
        method([isComplex, isBoolean], apply(fn)(identity, complex)),
        method([isBoolean, isComplex], apply(fn)(complex, identity))
      )(fn) as typeof fn
      return [fn, isSpecies<T>(species), create]
    }
  }
}

/**
 * Generates a function based off the passed parameter which has the
 * left child bound.
 * @param fn A BinaryFn which will have its left operand bound
 * @returns A closure which behaves like a UnaryFn
 */
export const partialLeft = <T extends TreeNode, R = void>(fn: BinaryFn<T, R>) =>
  (left: Writer<TreeNode, Operation>): UnaryFn<T> =>
    multi(method((right: Writer<TreeNode, Operation>) => fn(left, right)))

export const partialRight = <T extends TreeNode, R = void>(fn: BinaryFn<T, R>) =>
  (right: Writer<TreeNode, Operation>): UnaryFn<T> =>
    multi(method((left: Writer<TreeNode, Operation>) => fn(left, right)))

type MapFn<T extends TreeNode, R extends TreeNode = TreeNode> = 
  (t: Writer<T, Operation>) => Writer<R, Operation>

export const binaryFrom = <T extends TreeNode, R = void>(fn: BinaryFn<T, R>) =>
  (leftMap: MapFn<TreeNode> | undefined, rightMap: MapFn<TreeNode> | undefined) =>
    multi(
      method(
        (l: Writer<TreeNode, Operation>, r: Writer<TreeNode, Operation>) => fn(
          leftMap?.(l) ?? l, rightMap?.(r) ?? r
        )
      )
    ) as typeof fn
