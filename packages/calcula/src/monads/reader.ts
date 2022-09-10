export type Reader<E, T> = (env: E) => T

export const unit = <E, T>(t: T): Reader<E, T> => _ => t

export const bind = <E, A>(r: Reader<E, A>) => 
  <B>(fn: (a: A) => Reader<E, B>): Reader<E, B> =>
    (e: E) => fn(r(e))(e)

export const ask = <E>(env: E) => env

export const local = <E, T>(fn: (env: E) => E) =>
  (c: Reader<E, T>) =>
    (e: E) => c(fn(e))

// interface TreeNode {
//   value: number,
//   left?: TreeNode,
//   right?: TreeNode
// }

// type Environment = Map<string, number>

// const e: Environment = new Map<string, number>([['a', 3], ['b', 10]])

// const mn = unit<Environment, TreeNode>({value: 5, right: {value: 6}})
// const ma = bind(mn)<TreeNode>(a => env => ({...a, value: a.value + (env.get('a') ?? 5)}))

// const times2 = local<Environment, TreeNode>(ask)(env => ({value: env.get('a') ?? 0}))

// const a = ma(e)
// const a2 = times2(e)
