import { Multi, multi, method } from '@arrows/multimethod'
import { Writer } from "../monads/writer";
import { Particle, Operation, operation, context } from "./operation";
import { Species, TreeNode } from "./tree";

export type ToParticlesFn = (...expressions: Particle[][]) => Particle[]
export type LogFunctionalFn = 
  (action: string, ...expressions: Writer<TreeNode, Operation>[]) => Operation[]
export type ProcessLogsFn = 
  (
    toParticles: ToParticlesFn,
    species: Species, 
  ) => LogFunctionalFn

type ParameterNameFn = Multi
  & ((i: number, n: number) => string)

/**
 * Generates different names for the ith parameter. For the generic
 * ordinal case, implementation taken from:
 * https://codegolf.stackexchange.com/a/119563
 */
export const parameterName: ParameterNameFn = multi(
  method([1, 1], 'argument'),
  method([1, 2], 'left operand'),
  method([2, 2], 'right operand'),
  method(
    (i: number, _n: number) => i.toString()+[,'st','nd','rd'][i%100>>3^1&&i%10]||'th'
  )
)

export const processed = (argument: Particle[]): Particle[] => ['{', argument, '}']
export const processing = (argument: Particle[]): Particle[] => ['[', argument, ']']

/**
 * log entries with [] are flagged for processing in next log;
 * entries with {} have been processed in the current log;
 * these can occur simultaneously.
 * @param toParticles 
 * @param species 
 * @returns 
 */
export const processLogs: ProcessLogsFn = (toParticles, species) => 
  (action, ...expressions) => {
    const haveProcessed: Particle[][] = [], 
      toProcess = expressions.map(e => context(e, 0)),
      zeroth = toProcess.shift(), 
      n = species === Species.invoke ? -1 : expressions.length
    let i = 1
    return [
      // identified
      operation(
        toParticles(zeroth ?? [], ...toProcess), 
        `identified ${species.toLocaleLowerCase()}`
      ),
      // processing zeroth element log.
      ...(
        zeroth
          ? [
            operation(
              toParticles(processing(zeroth), ...toProcess),
              `processing ${parameterName(i, n)}`
            ),
            ...expressions.map(
              e => {
                const current = context(e, -1)
                const next = toProcess.shift()
                const currentOp = next
                  ? operation(
                      toParticles(
                        ...haveProcessed, 
                        processed(current), 
                        processing(next),
                        ...toProcess
                      ), 
                      `processed ${parameterName(i, n)}; processing ${parameterName(i+1, n)}`
                    )
                  : operation(
                      toParticles(...haveProcessed, processed(current), ...toProcess), 
                      `processed ${parameterName(i, n)}`
                    )
                haveProcessed.push(current)
                i++
                return [...e.log, currentOp]
              }
            ).flat(1),
          ] : []
      ),
      // action taken
      operation(toParticles(...haveProcessed), action)
    ]
  }
