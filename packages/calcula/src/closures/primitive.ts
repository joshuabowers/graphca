import { method, multi, fromMulti, Multi } from '@arrows/multimethod'
import { Writer, bind, writer } from '../monads/writer'
import { Operation, operation, Action } from '../utility/operation'
// import { CastFn } from '../utility/typings'
import { 
  TreeNode, Clades, Species, isClade, TreeNodeGuardFn, isSpecies 
} from '../utility/tree'

export type PrimitiveNode = TreeNode & {
  readonly clade: Clades.primitive
}

export type Primitive<S extends Species, F extends {}|undefined> =
  PrimitiveNode & {readonly species: S} 
  & (F extends undefined ? {} : {readonly raw: Readonly<F>})

export const isPrimitive = isClade<PrimitiveNode>(Clades.primitive)

// NOTE: Primitive types defined here to bootstrap primitive.
export type Real = Primitive<Species.real, number> 
export type Complex = Primitive<Species.complex, {a: number, b: number}> 
export type Boolean = Primitive<Species.boolean, boolean> 
export type Nil = Primitive<Species.nil, undefined>
export type NaN = Primitive<Species.nan, number>

type GuardFn = (...value: unknown[]) => boolean
type CaseFn<I extends PrimitiveNode, T extends PrimitiveNode> = 
  (input: Writer<I, Operation>) => Writer<T, Operation>

export type PrimitiveFn<Params extends any[], T extends PrimitiveNode> = Multi
  & ((...raw: Params) => Writer<T, Operation>)
  & CaseFn<Real, T>
  & CaseFn<Complex, T>
  & CaseFn<Boolean, T>

export type CreateFn<Params extends any[], T extends PrimitiveNode> = 
  (...params: Params) => T

export type PrimitiveMetaTuple<Params extends any[], T extends PrimitiveNode> = [
  PrimitiveFn<Params, T>,
  TreeNodeGuardFn<T>,
  CreateFn<Params, T>
]

export const when = <Params, Fields, T extends PrimitiveNode & Fields>(
  predicate: ((params: Params) => boolean) | GuardFn,
  fn: Action<TreeNode>
) => 
  method(predicate, (params: Params|T) => {

  })

export type WhenFn = typeof when

export const primitive = <
  Params extends any[], 
  Fields extends {}, 
  T extends PrimitiveNode & {raw: Fields}
>(
  guard: GuardFn,
  convert: ((...raw: Params) => Fields),
  species: Species,
  toString: (p: T) => string
) => {
  type HandleFn<P extends PrimitiveNode> = (p: P) => Params
  const create: CreateFn<Params, T> = (...params: Params): T =>
    ({
      clade: Clades.primitive,
      species,
      raw: convert(...params)
    }) as T
  const handle = <P extends PrimitiveNode>(fn: HandleFn<P>) =>
    (other: Writer<P, Operation>) =>
      bind(other, input => {
        const params = fn(input)
        const value = create(...params)
        const action =  species === input.species
          ? `copied ${input.species}`
          : `cast to ${species} from ${input.species}`
        return writer(
          value,
          operation([toString(value)], action)
        )
      })
  return (
    whenReal: HandleFn<Real>,
    whenComplex: HandleFn<Complex>,
    whenBoolean: HandleFn<Boolean>
  ) => {
    const fn: PrimitiveFn<Params, T> = multi(
      (v: Writer<TreeNode, Operation>) => v?.value?.species,
      method(
        guard, 
        (...n: Params): Writer<T, Operation> => {
          const value = create(...n)
          return writer(
            value,
            operation([toString(value)], `created ${species.toLocaleLowerCase()}`)
          )
        }
      ),
      method(Species.real, handle(whenReal)),
      method(Species.complex, handle(whenComplex)),
      method(Species.boolean, handle(whenBoolean))
    )
    return (
      ...methods: (typeof method)[]
    ): PrimitiveMetaTuple<Params, T> => [
      methods.length > 0 ? fromMulti(...methods)(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }  
}
