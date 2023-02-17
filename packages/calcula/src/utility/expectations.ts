import { method, multi, Multi, _ } from '@arrows/multimethod'
import { isWriter, Writer } from '../monads/writer'
import { Operation, stringify } from './operation'
import { TreeNode, Notation, Species } from './tree'
import { Real, Complex, isReal, isComplex } from '../primitives'
import { Unicode } from '../Unicode'

export type ExpectCloseTo = Multi 
  & ((actual: Writer<Real, Operation>, expected: Writer<Real, Operation>, precision: number) => void)
  & ((actual: Writer<Complex, Operation>, expected: Writer<Complex, Operation>, precision: number) => void)

export const expectCloseTo: ExpectCloseTo = multi(
  method(
    [isReal, isReal, _], 
    (actual: Writer<Real, Operation>, expected: Writer<Real, Operation>, precision: number) => 
      expect(actual.value.value).toBeCloseTo(expected.value.value, precision)
  ),
  method(
    [isComplex, isComplex, _],
    (actual: Writer<Complex, Operation>, expected: Writer<Complex, Operation>, precision: number) => {
      expect(actual.value.a).toBeCloseTo(expected.value.a, precision)
      expect(actual.value.b).toBeCloseTo(expected.value.b, precision)
    }
  )
)

export type Op = [string, string]

export const expectWriterTreeNode = <
  Actual extends TreeNode,
  Expected extends TreeNode|Writer<TreeNode, Operation>
>(
  actual: Writer<Actual, Operation>, expected: Expected
) => (...operations: Op[]) => {
  expect(actual.value).toEqual(isWriter(expected) ? expected.value : expected)
  expect(actual.log.length).toEqual(operations.length)
  const stringified = actual.log.map(({particles, action}) => [stringify(particles), action])
  expect(stringified).toEqual(operations)
}

export const realOps = (value: string): Op[] => [[value, 'created real']]
export const complexOps = (a: string, b: string): Op[] => 
  [[`${a}${b[0] === '-' ? '' : '+'}${b}${Unicode.i}`, 'created complex']]
export const booleanOps = (value: string): Op[] => [[value, 'created boolean']]

export const variableOps = (name: string): Op[] => [[name, 'referenced variable']]

type ExpressionFn =
  ((argument: string) => string)
  & ((left: string, right: string) => string)

export const expression = (name: string, notation: Notation): ExpressionFn => {
  return function (left: string, right?: string): string {
    if(right){
      switch(notation){
        case Notation.infix:
          return `(${left}${name}${right})`
        case Notation.postfix:
          return 'error';
        case Notation.prefix:
          return `${name}(${left},${right})`
      }
    } else {
      switch(notation){
        case Notation.infix:
          return 'error';
        case Notation.postfix:
          return `(${left})${name}`;
        case Notation.prefix:
          return `${name}(${left})`
      }
    }
  }
}

export const binaryOps = (
  name: string, notation: Notation, species: Species
) => {
  const e = expression(name, notation)
  return (action: string, left: Op[], right: Op[], result: Op[]): Op[] => [
    [e(left[0][0], right[0][0]), `identified ${species.toLocaleLowerCase()}`],
    [e('['+left[0][0]+']', right[0][0]), 'processing left operand'],
    ...left,
    [e('{'+left[left.length-1][0]+'}', '['+right[0][0]+']'), 'processed left operand; processing right operand'],
    ...right,
    [e(left[left.length-1][0], '{'+right[right.length-1][0]+'}'), 'processed right operand'],
    [e(left[left.length-1][0], right[right.length-1][0]), action],
    ...result
  ]
}

export const addOps = binaryOps('+', Notation.infix, Species.add)
export const multiplyOps = binaryOps('*', Notation.infix, Species.multiply)
export const raiseOps = binaryOps('^', Notation.infix, Species.raise)
export const logOps = binaryOps('log', Notation.prefix, Species.log)

export const polygammaOps = binaryOps(Unicode.digamma, Notation.prefix, Species.polygamma)
export const permuteOps = binaryOps('P', Notation.prefix, Species.permute)
export const combineOps = binaryOps('C', Notation.prefix, Species.combine)

export const equalsOps = binaryOps('==', Notation.infix, Species.equals)
export const notEqualsOps = binaryOps('!=', Notation.infix, Species.notEquals)
export const lessThanOps = binaryOps('<', Notation.infix, Species.lessThan)
export const greaterThanOps = binaryOps('>', Notation.infix, Species.greaterThan)
export const lessThanEqualsOps = binaryOps('<=', Notation.infix, Species.lessThanEquals)
export const greaterThanEqualsOps = binaryOps('>=', Notation.infix, Species.greaterThanEquals)

export const andOps = binaryOps(Unicode.and, Notation.infix, Species.and)
export const orOps = binaryOps(Unicode.or, Notation.infix, Species.or)
export const xorOps = binaryOps(Unicode.xor, Notation.infix, Species.xor)
export const impliesOps = binaryOps(Unicode.implies, Notation.infix, Species.implies)
export const nandOps = binaryOps(Unicode.nand, Notation.infix, Species.nand)
export const norOps = binaryOps(Unicode.nor, Notation.infix, Species.nor)
export const xnorOps = binaryOps(Unicode.xnor, Notation.infix, Species.xnor)
export const converseOps = binaryOps(Unicode.converse, Notation.infix, Species.converse)

export const unaryOps = (
  name: string, notation: Notation, species: Species
) => {
  const e = expression(name, notation)
  return (action: string, argument: Op[], result: Op[]): Op[] => [
    [e(argument[0][0]), `identified ${species.toLocaleLowerCase()}`],
    [e('['+argument[0][0]+']'), 'processing argument'],
    ...argument,
    [e('{'+argument[argument.length-1][0]+'}'), 'processed argument'],
    [e(argument[argument.length-1][0]), action],
    ...result
  ]
}

export const absOps = unaryOps('abs', Notation.prefix, Species.abs)

export const cosOps = unaryOps('cos', Notation.prefix, Species.cos)
export const sinOps = unaryOps('sin', Notation.prefix, Species.sin)
export const tanOps = unaryOps('tan', Notation.prefix, Species.tan)
export const secOps = unaryOps('sec', Notation.prefix, Species.sec)
export const cscOps = unaryOps('csc', Notation.prefix, Species.csc)
export const cotOps = unaryOps('cot', Notation.prefix, Species.cot)

export const acosOps = unaryOps('acos', Notation.prefix, Species.acos)
export const asinOps = unaryOps('asin', Notation.prefix, Species.asin)
export const atanOps = unaryOps('atan', Notation.prefix, Species.atan)
export const asecOps = unaryOps('asec', Notation.prefix, Species.asec)
export const acscOps = unaryOps('acsc', Notation.prefix, Species.acsc)
export const acotOps = unaryOps('acot', Notation.prefix, Species.acot)

export const coshOps = unaryOps('cosh', Notation.prefix, Species.cosh)
export const sinhOps = unaryOps('sinh', Notation.prefix, Species.sinh)
export const tanhOps = unaryOps('tanh', Notation.prefix, Species.tanh)
export const sechOps = unaryOps('sech', Notation.prefix, Species.sech)
export const cschOps = unaryOps('csch', Notation.prefix, Species.csch)
export const cothOps = unaryOps('coth', Notation.prefix, Species.coth)

export const acoshOps = unaryOps('acosh', Notation.prefix, Species.acosh)
export const asinhOps = unaryOps('asinh', Notation.prefix, Species.asinh)
export const atanhOps = unaryOps('atanh', Notation.prefix, Species.atanh)
export const asechOps = unaryOps('asech', Notation.prefix, Species.asech)
export const acschOps = unaryOps('acsch', Notation.prefix, Species.acsch)
export const acothOps = unaryOps('acoth', Notation.prefix, Species.acoth)

export const gammaOps = unaryOps(Unicode.gamma, Notation.prefix, Species.gamma)
export const factorialOps = unaryOps('!', Notation.postfix, Species.factorial)

export const notOps = unaryOps(Unicode.not, Notation.prefix, Species.not)

export const evaluateOps = (expression: string, result: Op[]): Op[] => [
  [expression, 'looking for variables to substitute in expression'],
  ...result
]

export const substituteOps = (name: string, result: Op[]): Op[] => [
  [name, `substituting variable ${name}`],
  ...result
]

export const noSubstituteOps = (name: string): Op[] => [
  [name, `no substitution found in scope for variable ${name}`],
  ...variableOps(name)
]

const ordinal = (i: number) => i.toString()+[,'st','nd','rd'][i%100>>3^1&&i%10]||'th'

// Logging for invocation needs to start at the point of the invoke method,
// which would encompass most of the following logic, handled once. 
// After that point, the when functions would need to detail substitution
// phases.
export const invokeOps = 
  (action: string, expression: Op[]) => (...parameters: Op[][]) => 
    (scope: Record<string, string>) => (result: Op[]): Op[] => {
      const e = (exp: string, ...ps: string[]) =>
        `(${exp})(${ps.join(',')})`
      const haveProcessed: string[] = [], toProcess = parameters.map(p => p[0][0]),
        zeroth = toProcess.shift(), exp = expression[expression.length-1][0]
      return [
        [e(expression[0][0], zeroth ?? '', ...toProcess), 'identified invocation'],
        [e('['+expression[0][0]+']', zeroth ?? '', ...toProcess), 'processing expression'],
        ...expression,
        [e('{'+expression[0][0]+'}', zeroth ?? '', ...toProcess), 'processed expression'],
        // process arguments
        ...(zeroth 
          ? [
            [e(exp, '['+zeroth+']', ...toProcess), 'processing 1st'] as Op,
            ...parameters.map(
              (p, i) => {
                const next = toProcess.shift(), current = p[p.length-1][0]
                const entry = (
                  next
                    ? [
                      e(exp, ...haveProcessed, '{'+current+'}', '['+next+']', ...toProcess), 
                      `processed ${ordinal(i+1)}; processing ${ordinal(i+2)}`
                    ] : [
                      e(exp, ...haveProcessed, '{'+current+'}'), 
                      `processed ${ordinal(i+1)}`
                    ]
                ) as Op
                haveProcessed.push(p[p.length-1][0])
                return [...p, entry] as Op[]
              }
            ).flat(1)
          ]
          : []
        ),
        // Add op for showcasing active scope for this invocation.
        // Scope should abstract the live construct. So, something like:
        // const scope = Map<string, string>()
        // where the first string corresponds to variable name, and the
        // second corresponds to the stringified Particle[] for the variable's
        // established value. Scope entries should be updated in the process
        // arguments stage, set to the value of p[-1][0]. (i.e. fully processed.)
        // Entries should look something like an assignment:
        // x := 5
        // y := z+10
        [e(expression[0][0], ...haveProcessed), action],
        [
          '{'+Object.entries(scope).map(([k,v]) => `${k}:=${v}`).join(',')+'}', 
          'established scope'
        ],
        ...result
      ]
    }
