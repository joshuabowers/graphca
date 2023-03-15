import { Writer } from "../monads/writer"

/**
 * Desirable Log Output for various steps:
 * ln(variable('x')) => [
 *    ['|ln(x)', 'identified logarithm'],
 *    ['ln|(x)', 'using `e` as logarithm base'],
 *    ['|e', 'created real'],
 *    ['log(e,|x)', 'processing argument'],
 *    ['|x', 'referenced variable'],
 *    ['log(e, x)|, 'created logarithm']
 * ]
 * 
 * raise(variable('x'), add(real(1), real(2)) => [
 *    ['|x^(1+2)', 'identified exponentiation'],
 *    ['(|x)^(1+2)', 'processing exponentiation base'],
 *    ['|x', 'referenced variable'],
 *    ['x^|(1+2)', 'processing exponentiation power'],
 *    ['|(1+2)', 'identified addition'],
 *    ['1|', 'created real'],
 *    ['2|', 'created real'],
 *    ['(1+2)|', 'performing real addition'],
 *    ['3|', 'created real'],
 *    ['x^3|', 'created exponentiation']
 * ]
 * 
 * Potential ramifications:
 * 1. a linear narrative should be possible, but requires extra context
 *    to properly identify the process.
 * 2. a singular expression---the thing being processed in the current
 *    step---should be sufficient; no explicit need for capturing both
 *    input and output as separate constructs.
 * 3. a 'process caret'---denoting the position within an expression that
 *    the current log operation is referencing---is imperative. The caret
 *    either denotes an operation which will be performed, or an operation
 *    which has been resolved.
 * 4. a hierarchical process---i.e. a unary or binary---would establish
 *    context for what will be processed, then include its children's
 *    processing logs, then, if no rewrite, establish that the hierarchical
 *    node was created. (The 'ln' example above might be a bit overzealous.)
 * 5. would it be possible to auto-generate complicated inputs without
 *    having to use the current systems signaled intent (i.e. the Rewrite
 *    construct)? Maybe, but would require certain things to be true about
 *    the logs coming from children. Notably, if the first log entry of a
 *    child writer detailed the process to be evaluated, a parent could
 *    use that when referring to an unprocessed child in its own logs.
 * 6. in the above 'exponentiation' example, as written, the exponent would
 *    already be resolved to 'real(3)' by the time that the raise
 *    function was evaluated. The context of the addition is lost for logging
 *    purposes. Or is it? Again, if a child's logs track the intended
 *    operation as the first part of their log, the child, 'real(3)' would
 *    have, as the first entry in its log, '|(1+2)' (or similar). A
 *    hierarchical process could use this to build its intended operation.
 */

export type Particle = string | Particle[]

// export interface Operation {
//   particles: Particle[]
//   action: string
// }

export type Operation = {
  particles: Particle[]
  action: string
} | Operation[]

export type Action<T> = [T|Writer<T, Operation>, string]
export type CaseFn<I> = (input: I) => Action<I>

export const operation = (particles: Particle[], action: string): Operation =>
  ({particles, action})

const subContext = (entry: Operation|undefined, version: number): Particle[] => {
  if(!entry){ return ['never'] }
  if(Array.isArray(entry)){
    const v = entry.at(version)
    return [...subContext(v, 0), '=>', ...subContext(v, -1)]
  } else {
    return entry.particles
  }
}

export const context = <T>(node: Writer<T, Operation>, version: number): Particle[] => 
  subContext(node.log.at(version), 0)
  // return Array.isArray(entry) ? [entry[0].particles, entry] : entry ? entry.particles : ['never'] 

/**
 * Flattens and joins the argument into a string. Note that, due to type
 * peculiarities in TypeScript (as of ~4.7), Infinity causes
 * Array.prototype.flat to complain about infinite typing. Hence the
 * weird cast.
 * @param particles a nestable collection of strings
 * @returns a string formed by joining the particles together
 */
export const stringify = (particles: Particle[]) =>
  particles.flat(Infinity as 10).join('')

/**
 * Flattens its argument into an Iterable.
 * @param particles a nestable collection of strings
 */
export function *flatten(particles: Particle[]): IterableIterator<string>{
  for(let p of particles){
    if(Array.isArray(p)){
      yield *flatten(p)
    } else {
      yield p
    }
  }
}

/**
 * Flattens and joins the argument into a string. An alternative to
 * stringify as defined above. Consumes the flatten generator to reduce
 * the nestable argument into an array of string.
 * @param particles a nestable collection of strings
 * @returns a string formed by joining the particles together
 */
export const toString = (particles: Particle[]) =>
  [...flatten(particles)].join('')

export const interleave = <A, E>(array: A[], element: E): (A|E)[] =>
  array.flatMap((e, i) => i+1 < array.length ? [e, element] : e)
