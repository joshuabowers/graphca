import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, bind, unit, isWriter, Action } from "../monads/writer"
import { CastFn } from "../utility/typings"
import { 
  TreeNode, Clades, Genera, Species, isClade, any, TreeNodeGuardFn, isSpecies, isTreeNode 
} from "../utility/tree"
import { UnaryFn } from "./unary"
import { 
  Real, Complex, Boolean, Nil, NaN,
  isReal, isComplex, isBoolean,
  real, complex, nan
} from '../primitives'

export type BinaryNode = TreeNode & {
  readonly clade: Clades.binary,
  readonly left: Writer<TreeNode>,
  readonly right: Writer<TreeNode>
}

export type Binary<S extends Species, G extends Genera|undefined = undefined> =
  BinaryNode & {
    readonly genus: G,
    readonly species: S,
  }

export const isBinary = isClade<BinaryNode>(Clades.binary)

export const identity = <T>(t: T) => t
export const leftChild = <T extends BinaryNode>(t: Writer<T>) => t.value.left
export const rightChild = <T extends BinaryNode>(t: Writer<T>) => t.value.right

type BinaryCaseFn<L, R = L, T = L> = (l: L, r: R) => Action<T>
type BinaryCastFn<L, R = L, T = L> = (l: Writer<L>, r: Writer<R>) => Writer<T>

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

type UnaryPredicate<L> = (t: Writer<L>) => boolean 
type BinaryPredicate<L, R> = (l: Writer<L>, r: Writer<R>) => boolean  
type Test<T> = UnaryPredicate<T> | Writer<T> | typeof _
type CorrespondingFn<L, R> = (l: L, r: R) => Action<TreeNode>  
export type BinaryCreateFn<T extends BinaryNode> = 
  (l: Writer<TreeNode>, r: Writer<TreeNode>) => Action<T>

export const when = <L extends TreeNode, R extends TreeNode>( 
  predicate: Test<L> | [Test<L>, Test<R>] | BinaryPredicate<L, R>, 
  fn: Action<TreeNode> | CorrespondingFn<L, R>
  ) =>
  method(predicate, (l: Writer<L>, r: Writer<R>) =>
    bind(l, x => 
      bind(r, y => {
        const [result, action] = typeof fn === 'function' ? fn(x, y) : fn
        const output = isWriter(result) ? result.value : result
        return ({
          value: output,
          log: [
            {inputs: [x, y], output, action},
            ...(isWriter(result) ? result.log : [])
          ]
        })
      })
    )
  )

export type WhenFn = ReturnType<typeof when>
export type EdgeCaseFns = (when: WhenFn) => (typeof method)[]

const apply = <T, U>(fn: BinaryFn<T, U>) =>
  <L extends TreeNode, R extends TreeNode>(
    changeLeft: CastFn<Writer<L>, L|R>, 
    changeRight: CastFn<Writer<R>, L|R>
  ) =>
    (l: Writer<L>, r: Writer<R>) =>
      fn(changeLeft(l), changeRight(r))

const eitherNilOrNaN = any(Species.nil, Species.nan)

export type BinaryNodeMetaTuple<T extends BinaryNode, R> = [
  BinaryFn<T, R>,
  TreeNodeGuardFn<T>,
  BinaryCreateFn<T>
]

export const binary = <T extends BinaryNode, R = void>(
  species: Species, genus?: Genera
) => {
  type Result<U extends TreeNode> = R extends void ? U : (R extends TreeNode ? R : never)
  const create = (left: Writer<TreeNode>, right: Writer<TreeNode>): Action<T> => [
    ({clade: Clades.binary, species, genus, left, right}) as T, 
    species.toLocaleLowerCase()
  ]
  // const when = createWhen(create)
  return (
    whenReal: BinaryCaseFn<Real, Real, Result<Real>>,
    whenComplex: BinaryCaseFn<Complex, Complex, Result<Complex>>,
    whenBoolean: BinaryCaseFn<Boolean, Boolean, Result<Boolean>>
  ) => {
    let fn: BinaryFn<T, R> = multi(
      when([isReal, isReal], whenReal),
      when([isComplex, isComplex], whenComplex),
      when([isBoolean, isBoolean], whenBoolean),
      when<Nil|NaN, TreeNode>([eitherNilOrNaN, _], (_l, _r) => [nan, 'not a number']),
      when<TreeNode, Nil|NaN>([_, eitherNilOrNaN], (_l, _r) => [nan, 'not a number']),
      when([isTreeNode, isTreeNode], (l, r) => create(unit(l), unit(r)))
    )
    return (...methods: (typeof method)[]): BinaryNodeMetaTuple<T, R> => {
      fn = fromMulti(
        ...methods,
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
  (left: Writer<TreeNode>): UnaryFn<T> =>
    multi(method((right: Writer<TreeNode>) => fn(left, right)))

export const partialRight = <T extends TreeNode, R = void>(fn: BinaryFn<T, R>) =>
  (right: Writer<TreeNode>): UnaryFn<T> =>
    multi(method((left: Writer<TreeNode>) => fn(left, right)))

type MapFn<T extends TreeNode, R extends TreeNode = TreeNode> = 
  (t: Writer<T>) => Writer<R>

export const binaryFrom = <T extends TreeNode, R = void>(fn: BinaryFn<T, R>) =>
  (leftMap: MapFn<TreeNode> | undefined, rightMap: MapFn<TreeNode> | undefined) =>
    multi(
      method(
        (l: Writer<TreeNode>, r: Writer<TreeNode>) => fn(
          leftMap?.(l) ?? l, rightMap?.(r) ?? r
        )
      )
    ) as typeof fn
