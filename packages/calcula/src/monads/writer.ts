import { method, multi, Multi, fromMulti, _ } from '@arrows/multimethod'

export interface Operation {
  input: unknown,
  action: string
}

export interface Writer<T> {
  value: T,
  log: Operation[]
}

export type WriterFn<T, U = T> = (value: T) => Writer<U>
export type Action<T> = [T|Writer<T>, string]
export type CaseFn<I> = (input: I) => Action<I>

export const unit = <T>(value: T): Writer<T> => ({value, log: []})

export const bind = <T, U = T>(writer: Writer<T>, transform: WriterFn<T, U>): Writer<U> => {
  const {value, log} = writer
  const {value: result, log: updates} = transform(value)
  return {value: result, log: [...log, ...updates]}
}

export const pipe = <T>(writer: Writer<T>, ...transforms: WriterFn<T>[]): Writer<T> =>
  transforms.reduce(bind, writer)

export const isWriter = <T>(obj: unknown): obj is Writer<T> =>
  typeof obj === 'object' && ('value' in (obj ?? {})) && ('log' in (obj ?? {}))


type Variable = {[$kind]: 'Variable', name: string, value: Writer<Node>}

type BinaryFields = {left: Writer<Node>, right: Writer<Node>}
type BinaryForm<T extends string> = Form<T, BinaryFields>

type Addition = BinaryForm<'Addition'>
type Multiplication = BinaryForm<'Multiplication'>
type BinaryOperators = Addition | Multiplication

type Equality = BinaryForm<'Equality'>
type Inequality = BinaryForm<'Inequality'>
type Inequalities = Equality | Inequality

type Conjunction = BinaryForm<'Conjunction'>
type Connectives = Conjunction

type Binary = BinaryOperators | Inequalities | Connectives

type UnaryFields = {expression: Writer<Node>}
type UnaryForm<T extends string> = Form<T, UnaryFields>

type Absolute = UnaryForm<'Absolute'> 
type Factorial = UnaryForm<'Factorial'>

type Sine = UnaryForm<'Sine'> 
type Cosine = UnaryForm<'Cosine'>
type Trigonometric = Sine | Cosine

type Unary = Absolute | Factorial | Trigonometric

type Node = Primitive | Unary | Binary | Variable | Nil

type CreateFn<T, U> = (value: T) => U
type CastFn<T, U> = (value: T) => Writer<U>
type WhenFn<T, U, V> = (create: CreateFn<V, U>) => CastFn<T, U>


const isUnary = (v: unknown): v is Writer<Unary> => 
  typeof v === 'object' && v! && isWriter(v) 
  && typeof v.value === 'object' && v.value! && 'expression' in v.value

const isBinary = (v: unknown): v is Writer<Binary> =>
  isWriter(v) && typeof v.value === 'object' && v.value! 
  && 'left' in v.value && 'right' in v.value

export const variable = (name: string, value: Writer<Node> = nil): Writer<Variable> => 
  unit({[$kind]: 'Variable', name, value})

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
  kind: Kinds
) => {
  const create = (expression: Writer<Node>): Action<T> => [
    ({[$kind]: kind, expression}) as T,
    kind.toLocaleLowerCase()
  ]
  return (
    whenReal: CaseFn<Real>,
    whenComplex: CaseFn<Complex>,
    whenBoolean: CaseFn<Boolean>
  ) => {
    const fn: UnaryFn<T> = multi(
      (v: Writer<Node>) => v?.value?.[$kind],
      method('Real', unaryMap(whenReal)),
      method('Complex', unaryMap(whenComplex)),
      method('Boolean', unaryMap(whenBoolean)),
      method('Nil', unaryMap(whenNilOrNaN)),
      method('NaN', unaryMap(whenNilOrNaN)),
      method(unaryMap<Node>(input => create(unit(input))))
    )
    return (
      ...methods: (typeof method)[]
    ): typeof fn => methods.length > 0 ? fromMulti(...methods)(fn) : fn
  }
}

export const absolute = unary<Absolute>('Absolute')(
  r => [real(Math.abs(r.value)), 'absolute value'],
  c => [complex([Math.hypot(c.a, c.b), 0]), 'absolute value'],
  b => [b, 'absolute value']
)()

export const sin = unary<Sine>('Sine')(
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
          log: [
            ...(isWriter(value) ? value.log : []), 
            {input: [x, y], action}
          ]
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
const leftChild = <T extends Binary>(t: Writer<T>) => t.value.left
const rightChild = <T extends Binary>(t: Writer<T>) => t.value.right

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
      log: [
        ...l.log, ...r.log,
        {input: [l.value, r.value], action}, 
        ...(isWriter(result) ? result.log : [])
      ]
    })
  })

const binary = <T extends Binary, R = void>(
  kind: Kinds
) => {
  type Result<U extends Node> = R extends void ? U : R
  const create = (left: Writer<Node>, right: Writer<Node>): Action<T> => [({
    [$kind]: kind, left, right
  }) as T, kind.toLocaleLowerCase()]
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
      method(binaryMap<Node, Node, T>((l, r) => create(unit(l), unit(r))))
    )
    return (...methods: (typeof method)[]) => {
      fn = fromMulti(
        ...methods,
        method([is('Real'), is('Complex')], apply(fn)(complex, identity)),
        method([is('Complex'), is('Real')], apply(fn)(identity, complex)),
        method([is('Real'), is('Boolean')], apply(fn)(identity, real)),
        method([is('Boolean'), is('Real')], apply(fn)(real, identity)),
        method([is('Complex'), is('Boolean')], apply(fn)(identity, complex)),
        method([is('Boolean'), is('Complex')], apply(fn)(complex, identity))
      )(fn) as typeof fn
      return fn
    }
  }
}

export const partialLeft = <T extends Node, R = void>(fn: BinaryFn<T, R>) =>
  (left: Writer<Node>): UnaryFn<T> =>
    multi(method((right: Writer<Node>) => fn(left, right)))

export const partialRight = <T extends Node, R = void>(fn: BinaryFn<T, R>) =>
  (right: Writer<Node>): UnaryFn<T> =>
    multi(method((left: Writer<Node>) => fn(left, right)))

type MapFn<T extends Node, R extends Node = Node> = (t: Writer<T>) => Writer<R>
export const binaryFrom = <T extends Node, R = void>(fn: BinaryFn<T, R>) =>
  (leftMap: MapFn<Node> | undefined, rightMap: MapFn<Node> | undefined) =>
    multi(
      method(
        (l: Writer<Node>, r: Writer<Node>) => fn(
          leftMap?.(l) ?? l, rightMap?.(r) ?? r
        )
      )
    ) as typeof fn

type AdditionWithPrimitive = Addition & {right: Primitive}

const isPrimitive = any('Real', 'Complex', 'Boolean')

export const add = binary<Addition>('Addition')(
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
  when<Node, Real>([_, isValue(real(0))], (l, _r) => [l, 'additive identity']),
  when<AdditionWithPrimitive, Primitive>(
    (l, r) => is('Addition')(l) 
      && isPrimitive(l.value.right) 
      && isPrimitive(r), 
    (l, r) => [
      add(l.value.left, add(l.value.right, r)), 
      'combine primitives across nesting levels'
    ]),
  when(deepEquals, (l, _r) => [
    multiply(real(2), l), 'equivalence: replaced with double'
  ]),
  when<Addition, Node>(deepEqualsAt(leftChild, identity), (l, _r) => [
    add(multiply(real(2), l.value.left), l.value.right),
    'combined like terms'
  ])
)

export const subtract = binaryFrom(add)(undefined, r => multiply(real(-1), r))

export const multiply = binary<Multiplication>('Multiplication')(
  (l, r) => [real(l.value * r.value), 'real multiplication'],
  (l, r) => [complex([0, 0]), 'complex multiplication'],
  (l, r) => [boolean(false), 'boolean multiplication']
)()

export const negate = partialLeft(multiply)(real(-1))
export const double = partialLeft(multiply)(real(2))

export const equals = binary<Equality, Boolean>('Equality')(
  (l, r) => [boolean(l.value === r.value), 'real equality'],
  (l, r) => [boolean(l.a === r.a && l.b === r.b), 'complex equality'],
  (l, r) => [boolean(l.value === r.value), 'boolean equality']
)(
  when<Unary, Unary>(
    [isUnary, isUnary], 
    (l, r) => [
      equals(l.value.expression, r.value.expression), 
      'unary equality'
    ]
  )
)
