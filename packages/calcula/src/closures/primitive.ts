import { method, multi, fromMulti, Multi } from '@arrows/multimethod'
import { Writer, bind, writer } from '../monads/writer'
import { Operation, operation } from '../utility/operation'
import { CreateFn, CastFn } from '../utility/typings'
import { 
  TreeNode, Clades, Species, isClade, TreeNodeGuardFn, isSpecies 
} from '../utility/tree'
// import { rule, process, resolve } from '../utility/rule'

export type PrimitiveNode = TreeNode & {
  readonly clade: Clades.primitive
}

export type Primitive<S extends Species, F extends {}> =
  PrimitiveNode & {readonly species: S} & Readonly<F>

export const isPrimitive = isClade<PrimitiveNode>(Clades.primitive)

// NOTE: Primitive types defined here to bootstrap primitive.
export type Real = Primitive<Species.real, {value: number}> 
export type Complex = Primitive<Species.complex, {a: number, b: number}> 
export type Boolean = Primitive<Species.boolean, {value: boolean}> 
export type Nil = Primitive<Species.nil, {}>
export type NaN = Primitive<Species.nan, {value: number}>

type GuardFn<T> = (value: unknown) => value is T

export type PrimitiveFn<T, U> = Multi
  & CastFn<U, T>
  & CastFn<Writer<Real, Operation>, T>
  & CastFn<Writer<Complex, Operation>, T>
  & CastFn<Writer<Boolean, Operation>, T>

export type PrimitiveMetaTuple<T extends PrimitiveNode, U> = [
  PrimitiveFn<T, U>,
  TreeNodeGuardFn<T>,
  CreateFn<U, T>
]

export const primitive = <Params, Fields, T extends PrimitiveNode & Fields>(
  guard: GuardFn<Params>,
  paramsMap: ((u: Params) => Fields),
  species: Species,
  toString: (p: T) => string
) => {
  type HandleFn<P extends PrimitiveNode> = (p: P) => Params
  const create: CreateFn<Params, T> = (params: Params): T =>
    ({
      clade: Clades.primitive,
      species,
      ...paramsMap(params)
    }) as T
  const handle = <P extends PrimitiveNode>(fn: HandleFn<P>) =>
    (other: Writer<P, Operation>) =>
      bind(other, input => {
        const params = fn(input)
        const value = create(params)
        const action =  species === input.species
          ? `copied ${input.species}`
          : `cast to ${species} from ${input.species}`
        return writer(
          value,
          operation([toString(value)], action)
        )
        // return ({
        //   value: value,
        //   log: [{input: rule`${input}`, rewrite: rule`${value}`, action}]
        // })
      })
  return (
    whenReal: HandleFn<Real>,
    whenComplex: HandleFn<Complex>,
    whenBoolean: HandleFn<Boolean>
  ) => {
    const fn: PrimitiveFn<T, Params> = multi(
      (v: Writer<TreeNode, Operation>) => v?.value?.species,
      method(
        guard, 
        (n: Params): Writer<T, Operation> => {
          const value = create(n)
          return writer(
            value,
            operation([toString(value)], `created ${species.toLocaleLowerCase()}`)
          )
          // return ({
          //   result: value, 
          //   log: [{
          //     input: process`${value}`,
          //     rewrite: resolve`${value}`,
          //     action: `created ${species.toLocaleLowerCase()}`
          //   }]
          // })
        }
      ),
      method(Species.real, handle(whenReal)),
      method(Species.complex, handle(whenComplex)),
      method(Species.boolean, handle(whenBoolean))
    )
    return (
      ...methods: (typeof method)[]
    ): PrimitiveMetaTuple<T, Params> => [
      methods.length > 0 ? fromMulti(...methods)(fn) : fn,
      isSpecies<T>(species),
      create
    ]
  }  
}
