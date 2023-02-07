export interface Writer<Value, Operation> {
  value: Value,
  log: Operation[]
}

export type WriterFn<V, O, N = V> = (result: V) => Writer<N, O>

export const unit = <V, O>(result: V): Writer<V, O> => ({value: result, log: []})

export const bind = <V, O, N = V>(
  writer: Writer<V, O>, 
  transform: WriterFn<V, O, N>
): Writer<N, O> => {
  const {value: current, log} = writer
  const {value: result, log: updates} = transform(current)
  return {value: result, log: [...log, ...updates]}
}

export const pipe = <V, O>(writer: Writer<V, O>, ...transforms: WriterFn<V, O>[]): Writer<V, O> =>
  transforms.reduce(bind, writer)

export const isWriter = <V, O>(obj: unknown): obj is Writer<V, O> =>
  typeof obj === 'object' && ('value' in (obj ?? {})) && ('log' in (obj ?? {}))

export const writer = <V, O>(
  value: V|Writer<V, O>, ...operations: O[]
): Writer<V, O> => 
  isWriter(value) 
    ? ({value: value.value, log: [...operations, ...value.log]})
    : ({value, log: [...operations]})

export const curate = <T, O>(input: Writer<T, O>) =>
  writer(input.value, input.log[input.log.length-1])
