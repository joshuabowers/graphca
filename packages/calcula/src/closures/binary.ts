// import { method, multi, Multi, fromMulti } from '@arrows/multimethod'
// import { is } from './is'
// import { Base, Constructor } from './Expression'
// import { Real, real } from './real'
// import { Complex, complex } from './complex'
// import { Boolean } from './boolean'
// import { Nil } from './nil'

// export abstract class Binary extends Base {
//   constructor(readonly left: Base, readonly right: Base) { super() }
// }

// const coerce = (b: Boolean) => real(b.value ? 1 : 0)

// type when<P, R = P> = (left: P, right: P) => R
// type cast<L, R, V> = (left: L, right: R) => V

// type Choose<D, F> = F extends void ? D : F

// type BinaryFn<T, R = void> = Multi
//   & when<Real, Choose<Real, R>>
//   & cast<Real, Complex, Choose<Complex, R>>
//   & cast<Complex, Real, Choose<Complex, R>>
//   & when<Complex, Choose<Complex, R>>
//   & when<Boolean, Choose<Boolean, R>>
//   & cast<Boolean, Base, Choose<Real, R>>
//   & cast<Base, Boolean, Choose<Real, R>>
//   & cast<Nil, Base, Choose<Real, R>>
//   & cast<Base, Nil, Choose<Real, R>>
//   & when<Base, T>

// type MethodFn = typeof method

// export const binary = <T extends Binary, R = void>(
//   type: Constructor<T>, resultType?: Constructor<R>
// ) => {
//   type Result<U extends Base> = R extends void ? U : R
//   return (
//     whenRxR: when<Real, Result<Real>>,
//     whenCxC: when<Complex, Result<Complex>>,
//     whenBxB?: when<Boolean, Result<Boolean>>
//   ) => {
//     const whenBaseXBase: when<Base, T> = (l, r) => new type(l, r)
//     const fn: BinaryFn<T, R> = multi(
//       method([is(Real), is(Real)], whenRxR),
//       method([is(Complex), is(Complex)], whenCxC),
//       method([is(Boolean), is(Boolean)], (whenBxB ?? ((l: Boolean, r: Boolean) => fn(coerce(l), coerce(r))))),
//       method([is(Boolean), is(Base)], (l: Boolean, r: Base) => fn(coerce(l), r)),
//       method([is(Base), is(Boolean)], (l: Base, r: Boolean) => fn(l, coerce(r))),
//       method([is(Real), is(Complex)], (l: Real, r: Complex) => fn(complex(l.value, 0), r)),
//       method([is(Complex), is(Real)], (l: Complex, r: Real) => fn(l, complex(r.value, 0))),
//       method([is(Nil), is(Base)], real(NaN)),
//       method([is(Base), is(Nil)], real(NaN)),
//       method([is(Base), is(Base)], whenBaseXBase)
//     )
//     return (
//       ...methods: MethodFn[]
//     ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
//   }
// }

// export type BindTo = (unbound: Base, bound: Base) => [Base, Base]

// export const bindLeft: BindTo = (unbound, bound) => [bound, unbound]
// export const bindRight: BindTo = (unbound, bound) => [unbound, bound]

// export const unaryFrom = <T extends Binary>(fn: BinaryFn<T>, bind: BindTo) => {
//   type UnaryFn = Multi
//     & ((expression: Real) => Real)
//     & ((expression: Complex) => Complex)
//     & ((expression: Base) => T)
//   return (bound: Base) => multi(
//     method(is(Base), (unbound: Base) => fn(...bind(unbound, bound)))
//   ) as UnaryFn
// }

// type BinaryMapFn = (left: Base, right: Base) => [Base, Base]

// export const binaryFrom = <T extends Binary>(fn: BinaryFn<T>, map: BinaryMapFn): BinaryFn<T> => (
//   multi(
//     method([is(Base), is(Base)], (l: Base, r: Base) => fn(...map(l, r)))
//   )
// )
import { method, multi, fromMulti, Multi, _ } from "@arrows/multimethod"
import { Writer, bind, unit, isWriter, Action } from "../monads/writer"
import { CastFn } from "../utility/typings"
import { 
  TreeNode, Clades, Genera, Species, isClade, any, TreeNodeGuardFn, isSpecies 
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

type BinaryFn<T, R = void> = Multi
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
type CorrespondingFn<L, R> = (l: Writer<L>, r: Writer<R>) => Action<TreeNode>  

export const when = <L extends TreeNode, R extends TreeNode>(
  predicate: Test<L> | [Test<L>, Test<R>] | BinaryPredicate<L, R>, 
  fn: CorrespondingFn<L, R>
) =>
  method(predicate, (l: Writer<L>, r: Writer<R>) => {
    const [result, action] = fn(l, r)
    return ({
      value: isWriter(result) ? result.value : result,
      log: [
        ...l.log, ...r.log,
        {input: [l.value, r.value], action}, 
        ...(isWriter(result) ? result.log : [])
      ]
    })
  })  

const binaryMap = <L, R, T>(fn: BinaryCaseFn<L, R, T>) =>
  (l: Writer<L>, r: Writer<R>) => 
    bind(l, x => {
      return bind(r, y => {
        const [value, action] = fn(x, y)
        return ({
          value: isWriter(value) ? value.value : value,
          log: [
            ...(isWriter(value) ? value.log : []), 
            {input: [x, y], action}
          ]
        })
      })
    })

const apply = <T, U>(fn: BinaryFn<T, U>) =>
  <L extends TreeNode, R extends TreeNode>(
    changeLeft: CastFn<Writer<L>, L|R>, 
    changeRight: CastFn<Writer<R>, L|R>
  ) =>
    (l: Writer<L>, r: Writer<R>) =>
      fn(changeLeft(l), changeRight(r))

const eitherNilOrNaN = any(Species.nil, Species.nan)

export type BinaryNodeFnGuardFnPair<T extends BinaryNode, R> = [BinaryFn<T, R>, TreeNodeGuardFn<T>]

export const binary = <T extends BinaryNode, R = void>(
  species: Species, genus?: Genera
) => {
  type Result<U extends TreeNode> = R extends void ? U : R
  const create = (left: Writer<TreeNode>, right: Writer<TreeNode>): Action<T> => [
    ({clade: Clades.binary, species, genus, left, right}) as T, 
    species.toLocaleLowerCase()
  ]
  return (
    whenReal: BinaryCaseFn<Real, Real, Result<Real>>,
    whenComplex: BinaryCaseFn<Complex, Complex, Result<Complex>>,
    whenBoolean: BinaryCaseFn<Boolean, Boolean, Result<Boolean>>
  ) => {
    let fn: BinaryFn<T, R> = multi(
      method([isReal, isReal], binaryMap(whenReal)),
      method([isComplex, isComplex], binaryMap(whenComplex)),
      method([isBoolean, isBoolean], binaryMap(whenBoolean)),
      when<Nil|NaN, TreeNode>([eitherNilOrNaN, _], (_l, _r) => [nan, 'not a number']),
      when<TreeNode, Nil|NaN>([_, eitherNilOrNaN], (_l, _r) => [nan, 'not a number']),
      method(binaryMap<TreeNode, TreeNode, T>((l, r) => create(unit(l), unit(r))))
    )
    return (...methods: (typeof method)[]): BinaryNodeFnGuardFnPair<T, R> => {
      fn = fromMulti(
        ...methods,
        method([isReal, isComplex], apply(fn)(complex, identity)),
        method([isComplex, isReal], apply(fn)(identity, complex)),
        method([isReal, isBoolean], apply(fn)(identity, real)),
        method([isBoolean, isReal], apply(fn)(real, identity)),
        method([isComplex, isBoolean], apply(fn)(identity, complex)),
        method([isBoolean, isComplex], apply(fn)(complex, identity))
      )(fn) as typeof fn
      return [fn, isSpecies<T>(species)]
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
