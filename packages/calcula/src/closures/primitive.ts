import { method, multi, fromMulti, Multi } from '@arrows/multimethod'
import { Writer, bind, unit, isWriter, Action } from '../monads/writer'
import { $kind, ASTNode, Form } from '../utility/ASTNode'
import { CreateFn, CastFn } from '../utility/typings'
import { Node, Kinds } from '../utility/nodes'

export type PrimitiveNode = {
  readonly isPrimitive: true,
  readonly isUnary: false,
  readonly isBinary: false
}

export type PrimitiveForm<K extends string, R extends {}> = 
  Form<K, Readonly<R> & PrimitiveNode>

// NOTE: Primitive types defined here to bootstrap primitive.
export type Real = PrimitiveForm<'Real', {value: number}> 
export type Complex = PrimitiveForm<'Complex', {a: number, b: number}> 
export type Boolean = PrimitiveForm<'Boolean', {value: boolean}> 
export type Nil = PrimitiveForm<'Nil', {}>
export type NaN = PrimitiveForm<'NaN', {value: number}>

type GuardFn<T> = (value: unknown) => value is T
type CreateCase<T, U, I> = (create: CreateFn<U, T>) => (input: I) => Action<T>

const primitiveMap = <T, U>(create: CreateFn<U, T>) =>
  <I>(fn: CreateCase<T, U, I>) =>
    (writer: Writer<I>) =>
      bind(writer, input => {
        const [value, action] = fn(create)(input)
        return ({
          value: isWriter(value) ? value.value : value,
          log: [...(isWriter(value) ? value.log : []), {input, action}]
        })
      })

export type PrimitiveFn<T, U> = Multi
  & CastFn<U, T>
  & CastFn<Writer<Real>, T>
  & CastFn<Writer<Complex>, T>
  & CastFn<Writer<Boolean>, T>

export const primitive = <Params, Fields, T extends ASTNode & Fields & PrimitiveNode>(
  guard: GuardFn<Params>,
  paramsMap: ((u: Params) => Fields),
  kind: Kinds
) => {
  const create: CreateFn<Params, T> = (params: Params): T =>
    ({
      [$kind]: kind,
      ...({
        isBinary: false,
        isUnary: false, 
        isPrimitive: true
      }) as PrimitiveNode,
      ...paramsMap(params)
    }) as T
  const pMap = primitiveMap(create)
  return (
    whenReal: CreateCase<T, Params, Real>,
    whenComplex: CreateCase<T, Params, Complex>,
    whenBoolean: CreateCase<T, Params, Boolean>
  ) => {
    const fn: PrimitiveFn<T, Params> = multi(
      (v: Writer<ASTNode>) => v.value[$kind],
      method(guard, (n: Params) => unit(create(n))),
      method('Real', pMap(whenReal)),
      method('Complex', pMap(whenComplex)),
      method('Boolean', pMap(whenBoolean))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }  
}
