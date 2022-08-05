import { method, multi, Multi, fromMulti, _ } from '@arrows/multimethod'
import { is } from './is'

export interface Operation {
  input: unknown,
  action: string
}

export interface Writer<T> {
  value: T,
  log: Operation[]
}

export type WriterFn<T, U = T> = (value: T) => Writer<U>

export const unit = <T>(value: T): Writer<T> => ({value, log: []})

export const bind = <T, U = T>(writer: Writer<T>, transform: WriterFn<T, U>): Writer<U> => {
  const {value, log} = writer
  const {value: result, log: updates} = transform(value)
  return {value: result, log: [...log, ...updates]}
}

export const pipe = <T>(writer: Writer<T>, ...transforms: WriterFn<T>[]): Writer<T> =>
  transforms.reduce(bind, writer)

// const squared = (x: number): Writer<number> => ({value: x * x, log: [{input: x, action: 'squared'}]})
// const doubled = (x: number): Writer<number> => ({value: 2 * x, log: [{input: x, action: 'doubled'}]})

// const result = pipe(unit(5), squared, doubled)

// result.log.map(op => `${op.input} was ${op.action}`)

// abstract class Base {
//   abstract readonly $kind: string
// }

// abstract class Binary extends Base {
//   constructor(readonly left: Base, readonly right: Base) {super()}
// }

// class Addition extends Binary {
//   readonly $kind = 'Addition'
// }

// abstract class Unary extends Base {
//   constructor(readonly expression: Base) {super()}
// }

// class Absolute extends Unary {
//   readonly $kind = 'Absolute'
// }

// abstract class Primitive<T> extends Base {
//   constructor(readonly value: T) {super()}
// }

// class Real extends Primitive<number> {
//   readonly $kind = 'Real'
// }

// class Complex extends Primitive<{a: number, b: number}> {
//   readonly $kind = 'Complex'
// }

// const isFunction = (value: unknown): value is Function => {
//   return typeof value === 'function'
// }

// const when = <L, R = L, P = L>(
//   predicate: L|R|[L, R]|((l: L, r: R) => boolean), 
//   result: P|((l: L, r: R) => P)
// ) =>
//   method(predicate, (l: L, r: R) => unit(isFunction(result) ? result.call(this, l, r) : result))

// type Constructor<T> = new (...args: any[]) => T

// type UnaryWhen<T, R = T> = (value: T) => Writer<R>

// type UnaryFn<T> = Multi & UnaryWhen<Real> & UnaryWhen<Complex> & UnaryWhen<T>

// const forward = <T>(fn: WriterFn<T>) => (value: T) => bind(unit(value), fn)

// type PrimitiveWhen<T, R = T> = (value: T) => R

// const wrap = <T, R>(fn: PrimitiveWhen<T, R>) => (value: T) => unit(fn(value))

// type PrimitiveFn<T, U extends Primitive<T>> = Multi 
//   & PrimitiveWhen<T, Writer<U>> 
//   & PrimitiveWhen<Real, Writer<U>> 
//   & PrimitiveWhen<Complex, Writer<U>>
//   & PrimitiveWhen<U, Writer<U>>

// const primitive = <T, U extends Primitive<T>>(rawType: Constructor<T>, type: Constructor<U>) => {
//   return (
//     whenT: PrimitiveWhen<T, U>,
//     whenReal: PrimitiveWhen<Real, U>,
//     whenComplex: PrimitiveWhen<Complex, U>
//   ) => {
//     const fn: PrimitiveFn<T, U> = multi(
//       when([real(5), real(2)], (l, r) => new Real(l.value.value + r.value.value)),
//       method(is(rawType), wrap(whenT)),
//       method(is(Real), wrap(whenReal)),
//       method(is(Complex), wrap(whenComplex)),
//       // method(is(Base), )
//     )
//     return (
//       ...methods: (typeof method)[]
//     ): typeof fn => fromMulti(...methods)(fn)
//   }
// }

// const real = primitive(Number, Real)(
//   n => new Real(n.valueOf()),
//   r => r,
//   c => new Real(c.value.a)
// )()

// class ComplexPair {
//   constructor(readonly a: number, readonly b: number) {}
// }

// const complex = primitive(ComplexPair, Complex)(
//   cp => new Complex(cp),
//   r => new Complex({a: r.value, b: 0}),
//   c => c
// )()

// const r = real(5)
// const c = complex({a: 1, b: 2})

// // Functionally incomplete: needs to handle return type overrides,
// // but also needs to properly box whenReal (, etc) as Writer<T>
// const unary = <T extends Unary>(type: Constructor<T>) => {
//   return (
//     whenReal: UnaryWhen<Real>,
//     whenComplex: UnaryWhen<Complex>
//   ) => {
//     const fn: UnaryFn<T> = multi(
//       method(is(Real), forward(whenReal)),
//       method(is(Complex), forward(whenComplex)),
//       method(is(Base), (value: Base) => new type(value))
//     )
//     return (
//       ...methods: (typeof method)[]
//     ): typeof fn => fromMulti(...methods)(fn)
//   }
// }

// // const abs = unary(Absolute)(
// //   r => Math.abs(r.value),
// //   c => complex(Math.hypot(c.a, c.b), 0)
// // )()

export const $kind = Symbol('$kind')

type Real = {[$kind]: 'Real', value: number}
type Complex = {[$kind]: 'Complex', a: number, b: number}
type Boolean = {[$kind]: 'Boolean', value: boolean}
type Nil = {[$kind]: 'Nil'}
type Primitive = Real | Complex | Boolean | Nil

type BinaryParams = {left: Node, right: Node}
type Addition = {[$kind]: 'Addition'}
type Multiplication = {[$kind]: 'Multiplication'}
type Binary = BinaryParams & (Addition | Multiplication)

type UnaryParams = {expression: Node}
type Absolute = {[$kind]: 'Absolute'}
type Factorial = {[$kind]: 'Factorial'}

type Sine = {[$kind]: 'Sine'}
type Cosine = {[$kind]: 'Cosine'}
type Trigonometric = Sine | Cosine

type Unary = UnaryParams & (Absolute | Factorial | Trigonometric)

type Node = Primitive | Unary | Binary

type GuardFn<T> = (value: unknown) => value is T
type CreateFn<T, U> = (value: T) => U
type CastFn<T, U> = (value: T) => Writer<U>
type WhenFn<T, U, V> = (create: CreateFn<V, U>) => CastFn<T, U>

type PrimitiveFn<T, U> = Multi
  & CastFn<U, T>
  & CastFn<Writer<Real>, T>
  & CastFn<Writer<Complex>, T>
  & CastFn<Writer<Boolean>, T>

const primitive = <T extends Primitive, U>(
  guard: GuardFn<U>,
  create: CreateFn<U, T>
) => {
  return (
    whenReal: WhenFn<Writer<Real>, T, U>,
    whenComplex: WhenFn<Writer<Complex>, T, U>,
    whenBoolean: WhenFn<Writer<Boolean>, T, U>,
  ) => {
    const fn: PrimitiveFn<T, U> = multi(
      (v: Writer<Primitive>) => v?.value?.[$kind],
      method(guard, (n: U) => unit(create(n))),
      method('Real', whenReal(create)),
      method('Complex', whenComplex(create)),
      method('Boolean', whenBoolean(create))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }  
}

const isNumber = (v: unknown): v is number => typeof v === 'number'
const isNumberTuple = (v: unknown): v is [number, number] =>
  Array.isArray(v) && v.length === 2 && isNumber(v[0]) && isNumber(v[1])
const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export const real = primitive<Real, number>(
  isNumber,
  value => ({[$kind]: 'Real', value})
)(
  _create => r => r,
  create => c => bind(c, x => ({value: create(x.a), log: [{input: x, action: 'cast to real'}]})),
  create => b => bind(b, x => ({value: create(x.value ? 1 : 0), log: [{input: x, action: 'cast to real'}]}))
)()

export const complex = primitive<Complex, [number, number]>(
  isNumberTuple,
  ([a, b]) => ({[$kind]: 'Complex', a, b})
)(
  create => r => bind(r, x => ({value: create([x.value, 0]), log: [{input: x, action: 'cast to complex'}]})),
  _create => c => c,
  create => b => bind(b, x => ({value: create([x.value ? 1 : 0, 0]), log: [{input: x, action: 'cast to complex'}]}))
)()

export const boolean = primitive<Boolean, boolean>(
  isBoolean,
  value => ({[$kind]: 'Boolean', value})
)(
  create => r => bind(r, x => ({value: create(x.value !== 0), log: [{input: x, action: 'cast to boolean'}]})),
  create => c => bind(c, x => ({value: create(x.a !== 0 || x.b !== 0), log: [{input: x, action: 'cast to boolean'}]})),
  _create => b => b
)()

type UnaryFn<T> = Multi
  & CastFn<Writer<Real>, Real>
  & CastFn<Writer<Complex>, Complex>
  & CastFn<Writer<Boolean>, Boolean>
  & CastFn<Writer<Node>, T>

const unary = <T extends Unary>(
  create: CreateFn<Node, T>
) => {
  return (
    whenReal: WhenFn<Writer<Real>, T, Node>,
    whenComplex: WhenFn<Writer<Complex>, T, Node>,
    whenBoolean: WhenFn<Writer<Boolean>, T, Node>
  )=> {
    const fn: UnaryFn<T> = multi(
      (v: Unary) => v[$kind],
      method('Real', whenReal(create)),
      method('Complex', whenComplex(create)),
      method('Boolean', whenBoolean(create)),
      method(create)
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => fromMulti(...methods)(fn)
  }
}

// const absolute = unary<Absolute>(
//   expression => ({[$kind]: 'Absolute', expression})
// )(
//   _create => r => bind(r, x => ({value: real(Math.abs(x.value)).value, log: [{input: x, action: 'absolute value'}]})),
//   _create => c => bind(c, x => ({value: complex([1, 1]), log: [{input: x, action: 'absolute value'}]})),
//   _create => b => bind(b, x => ({value: real(b), log: [{input: x, action: 'absolute value'}]}))
// )()
