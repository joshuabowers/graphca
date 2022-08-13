import { method, multi, Multi, fromMulti, _, inspect } from '@arrows/multimethod'
// import { is } from './is'

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

type Kind<T extends string> = {[$kind]: T}
type Form<K extends string, R extends {}> = Kind<K> & R

type Real = Form<'Real', {value: number}> 
type Complex = Form<'Complex', {a: number, b: number}> 
type Boolean = Form<'Boolean', {value: boolean}> 
type Nil = Kind<'Nil'>
type NaN = Form<'NaN', {value: number}>
type Primitive = Real | Complex | Boolean | Nil | NaN

type Variable = {[$kind]: 'Variable', name: string, value: Writer<Node>}

type BinaryParams = {left: Node, right: Node}
type BinaryForm<T extends string> = Form<T, BinaryParams>

type Addition = BinaryForm<'Addition'>
type Multiplication = BinaryForm<'Multiplication'>
type BinaryOperators = Addition | Multiplication

type Equality = BinaryForm<'Equality'>
type Inequality = BinaryForm<'Inequality'>
type Inequalities = Equality | Inequality

type Conjunction = BinaryForm<'Conjunction'>
type Connectives = Conjunction

type Binary = BinaryOperators | Inequalities | Connectives

type UnaryParams = {expression: Node}
type UnaryForm<T extends string> = Form<T, UnaryParams>

type Absolute = UnaryForm<'Absolute'> 
type Factorial = UnaryForm<'Factorial'>

type Sine = UnaryForm<'Sine'> 
type Cosine = UnaryForm<'Cosine'>
type Trigonometric = Sine | Cosine

type Unary = Absolute | Factorial | Trigonometric

type Node = Primitive | Unary | Binary | Variable | Nil

type GuardFn<T> = (value: unknown) => value is T
type CreateFn<T, U> = (value: T) => U
type CastFn<T, U> = (value: T) => Writer<U>
type WhenFn<T, U, V> = (create: CreateFn<V, U>) => CastFn<T, U>

type Action<T> = [T|Writer<T>, string]
type CaseFn<I> = (input: I) => Action<I>

type CreateCase<T, U, I> = (create: CreateFn<U, T>) => (input: I) => Action<T>

const is = (kind: Kinds) => <T extends Node>(t: Writer<T>) => t?.value?.[$kind] === kind

const isWriter = <T>(obj: unknown): obj is Writer<T> =>
  typeof obj === 'object' && ('value' in (obj ?? {})) && ('log' in (obj ?? {}))

const isUnary = (v: unknown): v is Writer<Unary> => 
  typeof v === 'object' && v! && isWriter(v) 
  && typeof v.value === 'object' && v.value! && 'expression' in v.value

const isBinary = (v: unknown): v is Writer<Binary> =>
  isWriter(v) && typeof v.value === 'object' && v.value! 
  && 'left' in v.value && 'right' in v.value

const areKindEqual = <T extends Node, U extends Node>(
  t: Writer<T>, u: Writer<U>
) => t.value[$kind] === u.value[$kind]

type KindPredicate<T extends Node> = (v: unknown) => v is Writer<T>
type CaseOfPredicate<T extends Node> = (left: T, right: T) => boolean
const caseOf = <T extends Node>(kind: Kinds | KindPredicate<T>) => 
  (fn: CaseOfPredicate<T> | boolean) =>
    method(
      typeof kind === 'string' ? [is(kind), is(kind)] : [kind, kind], 
      (l: Writer<T>, r: Writer<T>) => 
        areKindEqual(l, r) && (typeof fn === 'boolean' ? fn : fn(l.value, r.value)
      )
    )

type EqualsFn<T extends Node> = (left: Writer<T>, right: Writer<T>) => boolean
type DeepEqualsFn = Multi
  & EqualsFn<Real>
  & EqualsFn<Complex>
  & EqualsFn<Boolean>
  & EqualsFn<Nil>
  & EqualsFn<NaN>
  & EqualsFn<Variable>
  & EqualsFn<Unary>
  & EqualsFn<Binary>
  & EqualsFn<Node>

export const deepEquals: DeepEqualsFn = multi(
  caseOf<Real>('Real')((l, r) => l.value === r.value),
  caseOf<Complex>('Complex')((l, r) => l.a === r.a && l.b === r.b),
  caseOf<Boolean>('Boolean')((l, r) => l.value === r.value),
  caseOf<Nil>('Nil')(true),
  caseOf<NaN>('NaN')(false),
  caseOf<Variable>('Variable')((l, r) => l.name === r.name && deepEquals(l.value, r.value)),
  caseOf<Unary>(isUnary)((l, r) => deepEquals(unit(l.expression), unit(r.expression))),
  caseOf<Binary>(isBinary)(
    (l, r) => deepEquals(unit(l.left), unit(r.left)) 
      && deepEquals(unit(l.right), unit(r.right))
  ),
  method(false)
)

type WalkFn<T extends Node, R extends Node = T> = (t: Writer<T>) => Writer<R>
const deepEqualsAt = <L extends Node, R extends Node>(
  leftWalk: WalkFn<L, Node>,
  rightWalk: WalkFn<R, Node>
) => (l: Writer<L>, r: Writer<R>) => deepEquals(leftWalk(l), rightWalk(r))

type PrimitiveFn<T, U> = Multi
  & CastFn<U, T>
  & CastFn<Writer<Real>, T>
  & CastFn<Writer<Complex>, T>
  & CastFn<Writer<Boolean>, T>

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

const primitive = <T extends Primitive, U>(
  guard: GuardFn<U>,
  create: CreateFn<U, T>
) => {
  const pMap = primitiveMap(create)
  return (
    whenReal: CreateCase<T, U, Real>,
    whenComplex: CreateCase<T, U, Complex>,
    whenBoolean: CreateCase<T, U, Boolean>
  ) => {
    const fn: PrimitiveFn<T, U> = multi(
      (v: Writer<Node>) => v?.value?.[$kind],
      method(guard, (n: U) => unit(create(n))),
      method('Real', pMap(whenReal)),
      method('Complex', pMap(whenComplex)),
      method('Boolean', pMap(whenBoolean))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }  
}

export const nil: Writer<Nil> = unit({[$kind]: 'Nil'})
export const nan: Writer<NaN> = unit({[$kind]: 'NaN', value: NaN})

export const variable = (name: string, value: Writer<Node> = nil): Writer<Variable> => 
  unit({[$kind]: 'Variable', name, value})

const isNumber = (v: unknown): v is number => typeof v === 'number'
const isNumberTuple = (v: unknown): v is [number, number] =>
  Array.isArray(v) && v.length === 2 && isNumber(v[0]) && isNumber(v[1])
const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export const real = primitive<Real, number>(
  isNumber,
  value => ({[$kind]: 'Real', value})
)(
  _create => r => [r, ''],
  create => c => [create(c.a), 'cast to real'],
  create => b => [create(b.value ? 1 : 0), 'cast to real']
)()

export const complex = primitive<Complex, [number, number]>(
  isNumberTuple,
  ([a, b]) => ({[$kind]: 'Complex', a, b})
)(
  create => r => [create([r.value, 0]), 'cast to complex'],
  _create => c => [c, ''],
  create => b => [create([b.value ? 1 : 0, 0]), 'cast to complex']
)()

export const boolean = primitive<Boolean, boolean>(
  isBoolean,
  value => ({[$kind]: 'Boolean', value})
)(
  create => r => [create(r.value !== 0), 'cast to boolean'],
  create => c => [create(c.a !== 0 || c.b !== 0), 'cast to boolean'],
  _create => b => [b, '']
)()

type UnaryFn<T> = Multi
  & CastFn<Writer<Real>, Real>
  & CastFn<Writer<Complex>, Complex>
  & CastFn<Writer<Boolean>, Boolean>
  & CastFn<Writer<Nil|NaN>, NaN>
  & CastFn<Writer<Node>, T>

const unaryMap = <T>(fn: CaseFn<T>) =>
  (writer: Writer<T>) =>
    bind(writer, input => {
      const [value, action] = fn(input)
      return ({
        value: isWriter(value) ? value.value : value,
        log: [...(isWriter(value) ? value.log : []), {input, action}]
      })
    })

const whenNilOrNaN: CaseFn<Nil | NaN> = _input => [nan.value, 'not a number']

const unary = <T extends Unary>(
  create: CreateFn<Node, T>,
  action: string
) => {
  return (
    whenReal: CaseFn<Real>,
    whenComplex: CaseFn<Complex>,
    whenBoolean: CaseFn<Boolean>
  ) => {
    const whenNode: CaseFn<Node> = input => [create(input), action]
    const fn: UnaryFn<T> = multi(
      (v: Writer<Node>) => v?.value?.[$kind],
      method('Real', unaryMap(whenReal)),
      method('Complex', unaryMap(whenComplex)),
      method('Boolean', unaryMap(whenBoolean)),
      method('Nil', unaryMap(whenNilOrNaN)),
      method('NaN', unaryMap(whenNilOrNaN)),
      method(unaryMap(whenNode))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }
}

export const absolute = unary<Absolute>(
  expression => ({[$kind]: 'Absolute', expression}),
  'absolute value'
)(
  r => [real(Math.abs(r.value)), 'absolute value'],
  c => [complex([Math.hypot(c.a, c.b), 0]), 'absolute value'],
  b => [b, 'absolute value']
)()

export const sin = unary<Sine>(
  expression => ({[$kind]: 'Sine', expression}),
  'sine'
)(
  r => [real(Math.sin(r.value)), 'computed sine'],
  c => [
    complex([
      Math.sin(c.a) * Math.cosh(c.b),
      Math.cos(c.a) * Math.sinh(c.b)
    ]),
    'computed sine'
  ],
  b => [boolean(real(Math.sin(b.value ? 1 : 0))), 'computed sine']
)()

type BinaryCreateFn<L, R, T> = (l: L, r: R) => Action<T>
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
  & BinaryCastFn<Nil|NaN, Node, NaN>
  & BinaryCastFn<Node, Nil|NaN, NaN>
  & BinaryCastFn<Node, Node, T>

const binaryMap = <L, R, T>(fn: BinaryCaseFn<L, R, T>) =>
  (l: Writer<L>, r: Writer<R>) => 
    bind(l, x => {
      return bind(r, y => {
        const [value, action] = fn(x, y)
        return ({
          value: isWriter(value) ? value.value : value,
          log: [...(isWriter(value) ? value.log : []), {input: [x, y], action}]
        })
      })
    })

const apply = <T, U>(fn: BinaryFn<T, U>) =>
  <L extends Node, R extends Node>(
    changeLeft: CastFn<Writer<L>, L|R>, 
    changeRight: CastFn<Writer<R>, L|R>
  ) =>
    (l: Writer<L>, r: Writer<R>) =>
      fn(changeLeft(l), changeRight(r))

const identity = <T>(t: T) => t
const leftChild = <T extends Binary>(t: Writer<T>) => unit(t.value.left)
const rightChild = <T extends Binary>(t: Writer<T>) => unit(t.value.right)

type Kinds = Node[typeof $kind]

const notAny = (...args: Kinds[]) => <T extends Node>(t: Writer<T>) => t.value && !args.includes(t.value[$kind])
const any = (...args: Kinds[]) => <T extends Node>(t: Writer<T>) => t.value && args.includes(t.value[$kind])

type UnaryPredicate<L> = (t: Writer<L>) => boolean 
type BinaryPredicate<L, R> = (l: Writer<L>, r: Writer<R>) => boolean
type toKind<T> = T extends {[$kind]: Kinds} ? T[typeof $kind] : never
type Test<T> = UnaryPredicate<T> | toKind<T> | Writer<T> | typeof _
type CorrespondingFn<L, R> = (l: Writer<L>, r: Writer<R>) => Action<Node>

const when = <L extends Node, R extends Node>(
  predicate: Test<L> | [Test<L>, Test<R>] | BinaryPredicate<L, R>, 
  fn: CorrespondingFn<L, R>
) =>
  method(predicate, (l: Writer<L>, r: Writer<R>) => {
    const [result, action] = fn(l, r)
    return ({
      value: isWriter(result) ? result.value : result,
      log: [{input: [l.value, r.value], action}, ...(isWriter(result) ? result.log : [])]
    })
  })

const binary = <T extends Binary, R = void>(
  create: BinaryCreateFn<Node, Node, T>
) => {
  type Result<U extends Node> = R extends void ? U : R
  return (
    whenReal: BinaryCaseFn<Real, Real, Result<Real>>,
    whenComplex: BinaryCaseFn<Complex, Complex, Result<Complex>>,
    whenBoolean: BinaryCaseFn<Boolean, Boolean, Result<Boolean>>
  ) => {
    let fn: BinaryFn<T, R> = multi(
      method([is('Real'), is('Real')], binaryMap(whenReal)),
      method([is('Complex'), is('Complex')], binaryMap(whenComplex)),
      method([is('Boolean'), is('Boolean')], binaryMap(whenBoolean)),
      when<Nil|NaN, Node>([any('Nil', 'NaN'), _], (_l, _r) => [nan, 'not a number']),
      when<Node, Nil|NaN>([_, any('Nil', 'NaN')], (_l, _r) => [nan, 'not a number']),
      method(binaryMap<Node, Node, T>((l, r) => create(l, r)))
    )
    fn = fromMulti(
      method([is('Real'), is('Complex')], apply(fn)(complex, identity)),
      method([is('Complex'), is('Real')], apply(fn)(identity, complex)),
      method([is('Real'), is('Boolean')], apply(fn)(identity, real)),
      method([is('Boolean'), is('Real')], apply(fn)(real, identity)),
      method([is('Complex'), is('Boolean')], apply(fn)(identity, complex)),
      method([is('Boolean'), is('Complex')], apply(fn)(complex, identity))
    )(fn) as typeof fn
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }
}

type AdditionWithPrimitive = Addition & {right: Primitive}

const isPrimitive = any('Real', 'Complex', 'Boolean')

export const add = binary<Addition>(
  (left, right) => [({[$kind]: 'Addition', left, right}), 'addition']
)(
  (l, r) => [real(l.value + r.value), 'real addition'],
  (l, r) => [complex([l.a + r.a, l.b + r.b]), 'complex addition'],
  (l, r) => [
    boolean((l.value || r.value) && !(l.value && r.value)), 
    'boolean addition'
  ]
)(
  when([
    any('Real', 'Complex', 'Boolean'), notAny('Real', 'Complex', 'Boolean')
  ], (l, r) => [add(r, l), 're-order operands']),
  when<Node, Real>([_, real(0)], (l, _r) => [l, 'additive identity']),
  when<AdditionWithPrimitive, Primitive>(
    (l, r) => is('Addition')(l) 
      && isPrimitive(unit(l.value.right)) 
      && isPrimitive(r), 
    (l, r) => [
      add(unit(l.value.left), add(unit(l.value.right), r)), 
      'combine primitives across nesting levels'
    ]),
  when(deepEquals, (l, _r) => [
    multiply(real(2), l), 'equivalence: replaced with double'
  ]),
  when<Addition, Node>(deepEqualsAt(leftChild, identity), (l, _r) => [
    add(multiply(real(2), unit(l.value.left)), unit(l.value.right)),
    'combined like terms'
  ])
)

export const multiply = binary<Multiplication>(
  (left, right) => [({[$kind]: 'Multiplication', left, right}), 'multiplication']
)(
  (l, r) => [real(l.value * r.value), 'real multiplication'],
  (l, r) => [complex([0, 0]), 'complex multiplication'],
  (l, r) => [boolean(false), 'boolean multiplication']
)()

export const equals = binary<Equality, Boolean>(
  (left, right) => [{[$kind]: 'Equality', left, right}, 'equality']
)(
  (l, r) => [boolean(l.value === r.value), 'real equality'],
  (l, r) => [boolean(l.a === r.a && l.b === r.b), 'complex equality'],
  (l, r) => [boolean(l.value === r.value), 'boolean equality']
)(
  when<Unary, Unary>(
    [isUnary, isUnary], 
    (l, r) => [
      equals(unit(l.value.expression), unit(r.value.expression)), 
      'unary equality'
    ]
  )
)

namespace BasicOOP {
  abstract class Base {
    abstract readonly $kind: string

    abstract add(right: Base): Base
  }

  abstract class Binary extends Base {
    constructor(readonly left: Base, readonly right: Base) {super()}

    add: Multi & ((right: Base) => Base) = multi(
      method(Base, (r: Base) => new Addition(this, r))
    )
  }

  class Addition extends Binary {
    readonly $kind = 'Addition'

    // add: Multi & ((right: Base) => Base) = fromMulti(
    //   method(Real.Zero, this)
    // )(super.add)
  }

  abstract class Unary extends Base {
    constructor(readonly expression: Base) {super()}

    add: Multi & ((right: Base) => Base) = multi(
      method(Base, (r: Base) => new Addition(this, r))
    )
  }

  class Absolute extends Unary {
    readonly $kind = 'Absolute'
  }

  abstract class Primitive<T> extends Base {
    constructor(readonly value: T) {super()}
  }

  class Real extends Primitive<number> {
    static readonly Zero = new Real(0)

    readonly $kind = 'Real'

    add: Multi & ((right: Base) => Base) = multi(
      (right: Base) => right.$kind,
      method('Real', (r: Real) => new Real(this.value + r.value)),
      method('Complex', (c: Complex) => new Complex({a: this.value + c.value.a, b: c.value.b})),
    )
  }

  class Complex extends Primitive<{a: number, b: number}> {
    readonly $kind = 'Complex'

    add: Multi & ((right: Base) => Base) = multi(
      (right: Base) => right.$kind,
      method('Real', (r: Real) => new Complex({a: this.value.a + r.value, b: this.value.b})),
      method('Complex', (c: Complex) => new Complex({a: this.value.a + c.value.a, b: this.value.b + c.value.b}))
    )
  }

  const r = new Real(5), c = new Complex({a: 1, b: 2})
  const a = r.add(c)
  const a2 = new Addition(r, c).add(new Real(10))
}

// Ideally: this would have specific visitors for every mathematical operation:
// e.g. there would be an AdditionVisitor, a multimethod, which would bundle all
// addition logic together. ???
namespace OOPWithVisitors {
  abstract class Base {
    abstract readonly $kind: string
  }

  abstract class Binary extends Base {
    constructor(readonly left: Base, readonly right: Base) {super()}
  }

  class Addition extends Binary {
    readonly $kind = 'Addition'
  }

  class AdditionWithPrimitive extends Addition {
    constructor(readonly left: Base, readonly right: Real|Complex) {super(left, right)}
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
}