import { method, multi, fromMulti, Multi } from '@arrows/multimethod'
import { Writer, bind, unit, isWriter, Action } from '../monads/writer'
import { CreateFn, CastFn } from '../utility/typings'
import { TreeNode, Clades, Species, isClade } from '../utility/tree'

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
type CreateCase<T, U, I> = (create: CreateFn<U, T>) => (input: I) => Action<T>

const primitiveMap = <T, U>(create: CreateFn<U, T>) =>
  <I>(fn: CreateCase<T, U, I>) =>
    (writer: Writer<I>) =>
      bind(writer, input => {
        const [value, action] = fn(create)(input)
        const output = isWriter(value) ? value.value : value
        return ({
          value: output,
          log: [...(isWriter(value) ? value.log : []), {input, output, action}]
        })
      })

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
  const create: CreateFn<Params, T> = (params: Params): T =>
    ({
      clade: Clades.primitive,
      species,
      ...paramsMap(params)
    }) as T
  const pMap = primitiveMap(create)
  return (
    whenReal: CreateCase<T, Params, Real>,
    whenComplex: CreateCase<T, Params, Complex>,
    whenBoolean: CreateCase<T, Params, Boolean>
  ) => {
    const fn: PrimitiveFn<T, Params> = multi(
      (v: Writer<TreeNode>) => v?.value?.species,
      method(guard, (n: Params) => unit(create(n))),
      method(Species.real, pMap(whenReal)),
      method(Species.complex, pMap(whenComplex)),
      method(Species.boolean, pMap(whenBoolean))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }  
}
