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

export const variable = (name: string, value: Writer<Node> = nil): Writer<Variable> => 
  unit({[$kind]: 'Variable', name, value})

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
