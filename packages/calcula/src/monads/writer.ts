export type Rewrite = () => string

export interface Operation {
  inputs: unknown[],
  rewrite: Rewrite,
  action: string
}

export interface Writer<T> {
  value: T,
  log: Operation[]
}

export type WriterFn<T, U = T> = (value: T) => Writer<U>
export type Action<T> = [T|Writer<T>, Rewrite, string]
export type CaseFn<I, O = I> = (input: I) => Action<O>

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
