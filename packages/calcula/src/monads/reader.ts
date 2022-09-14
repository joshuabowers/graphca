export type Reader<E, T> = (env: E) => T

export const unit = <E, T>(t: T): Reader<E, T> => _ => t

export const bind = <E, A>(r: Reader<E, A>) => 
  <B>(fn: (a: A) => Reader<E, B>): Reader<E, B> =>
    (e: E) => fn(r(e))(e)

export const ask = <E>(env: E) => env

export const local = <E, T>(fn: (env: E) => E) =>
  (c: Reader<E, T>) =>
    (e: E) => c(fn(e))
