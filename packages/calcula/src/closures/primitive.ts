import { method, multi, fromMulti, Multi } from '@arrows/multimethod'
import { Writer, bind } from '../monads/writer'
import { CreateFn, CastFn } from '../utility/typings'
import { TreeNode, Clades, Species, isClade } from '../utility/tree'
import { rule } from '../utility/rule'

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
  & CastFn<Writer<Real>, T>
  & CastFn<Writer<Complex>, T>
  & CastFn<Writer<Boolean>, T>

export const primitive = <Params, Fields, T extends PrimitiveNode & Fields>(
  guard: GuardFn<Params>,
  paramsMap: ((u: Params) => Fields),
  species: Species
) => {
  type HandleFn<P extends PrimitiveNode> = (p: P) => Params
  const create: CreateFn<Params, T> = (params: Params): T =>
    ({
      clade: Clades.primitive,
      species,
      ...paramsMap(params)
    }) as T
  const handle = <P extends PrimitiveNode>(fn: HandleFn<P>) =>
    (writer: Writer<P>) =>
      bind(writer, input => {
        const params = fn(input)
        const value = create(params)
        const action =  species === input.species
          ? `copied ${input.species}`
          : `cast to ${species} from ${input.species}`
        return ({
          value,
          log: [{input: rule`${input}`, rewrite: rule`${value}`, action}]
        })
      })
  return (
    whenReal: HandleFn<Real>,
    whenComplex: HandleFn<Complex>,
    whenBoolean: HandleFn<Boolean>
  ) => {
    const fn: PrimitiveFn<T, Params> = multi(
      (v: Writer<TreeNode>) => v?.value?.species,
      method(
        guard, 
        (n: Params): Writer<T> => {
          const value = create(n)
          return ({
            value, 
            log: [{
              input: rule`${value}`,
              rewrite: rule`${value}`,
              action: 'given primitive'
            }]
          })
        }
      ),
      method(Species.real, handle(whenReal)),
      method(Species.complex, handle(whenComplex)),
      method(Species.boolean, handle(whenBoolean))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }  
}
