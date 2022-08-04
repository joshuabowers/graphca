import { method, multi, Multi, fromMulti } from '@arrows/multimethod'
import { is } from './is'

export interface Operation<T> {
  input: T,
  action: string
}

export interface Writer<T> {
  value: T,
  log: Operation<T>[]
}

export type WriterFn<T> = (value: T) => Writer<T>

export const unit = <T>(value: T): Writer<T> => ({value, log: []})

export const bind = <T>(writer: Writer<T>, transform: WriterFn<T>): Writer<T> => {
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

abstract class Base {
  abstract readonly $kind: string
}

abstract class Binary extends Base {
  constructor(readonly left: Base, readonly right: Base) {super()}
}

class Addition extends Binary {
  readonly $kind = 'Addition'
}

abstract class Unary extends Base {
  constructor(readonly expression: Base) {super()}
}

class Absolute extends Unary {
  readonly $kind = 'Absolute'
}

abstract class Primitive<T> extends Base {
  constructor(readonly value: T) {super()}
}

class Real extends Primitive<number> {
  readonly $kind = 'Real'
}

class Complex extends Primitive<{a: number, b: number}> {
  readonly $kind = 'Complex'
}

type Constructor<T> = new (...args: any[]) => T

type UnaryWhen<T, R = T> = (value: T) => Writer<R>

type UnaryFn<T> = Multi & UnaryWhen<Real> & UnaryWhen<Complex> & UnaryWhen<T>

const forward = <T>(fn: WriterFn<T>) => (value: T) => bind(unit(value), fn)

type PrimitiveWhen<T, R = T> = (value: T) => R

const wrap = <T, R>(fn: PrimitiveWhen<T, R>) => (value: T) => unit(fn(value))

type PrimitiveFn<T, U extends Primitive<T>> = Multi 
  & PrimitiveWhen<T, Writer<U>> 
  & PrimitiveWhen<Real, Writer<U>> 
  & PrimitiveWhen<Complex, Writer<U>>
  & PrimitiveWhen<U, Writer<U>>

const primitive = <T, U extends Primitive<T>>(rawType: Constructor<T>, type: Constructor<U>) => {
  return (
    whenT: PrimitiveWhen<T, U>,
    whenReal: PrimitiveWhen<Real, U>,
    whenComplex: PrimitiveWhen<Complex, U>
  ) => {
    const fn: PrimitiveFn<T, U> = multi(
      method(is(rawType), wrap(whenT)),
      method(is(Real), wrap(whenReal)),
      method(is(Complex), wrap(whenComplex)),
      // method(is(Base), )
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => fromMulti(...methods)(fn)
  }
}

const real = primitive(Number, Real)(
  n => new Real(n.valueOf()),
  r => r,
  c => new Real(c.value.a)
)()

class ComplexPair {
  constructor(readonly a: number, readonly b: number) {}
}

const complex = primitive(ComplexPair, Complex)(
  cp => new Complex(cp),
  r => new Complex({a: r.value, b: 0}),
  c => c
)()

const r = real(5)
const c = complex({a: 1, b: 2})

// Functionally incomplete: needs to handle return type overrides,
// but also needs to properly box whenReal (, etc) as Writer<T>
const unary = <T extends Unary>(type: Constructor<T>) => {
  return (
    whenReal: UnaryWhen<Real>,
    whenComplex: UnaryWhen<Complex>
  ) => {
    const fn: UnaryFn<T> = multi(
      method(is(Real), forward(whenReal)),
      method(is(Complex), forward(whenComplex)),
      method(is(Base), (value: Base) => new type(value))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => fromMulti(...methods)(fn)
  }
}

// const abs = unary(Absolute)(
//   r => Math.abs(r.value),
//   c => complex(Math.hypot(c.a, c.b), 0)
// )()
