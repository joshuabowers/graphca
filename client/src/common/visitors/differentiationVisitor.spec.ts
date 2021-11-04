import { differentiationVisitor } from "./differentiationVisitor";
import { evaluateVisitor } from "./evaluateVisitor";
import { parser } from "../parser";
import { Scope } from "../Scope";
import { Node, Location } from 'pegase'
import { Real } from '../fields/Real'
import { Unicode } from "../MathSymbols";

const apply = (input: string, scope: Scope) => parser.value(
  input, {visit: [evaluateVisitor, differentiationVisitor], context: scope}
)

const parse = (input: string) => parser.value(
  input, {visit: evaluateVisitor}
)

type ScopeEntry = {[x: string]: Node}

const expectObject = (input: string, scopeEntries: ScopeEntry, expected: object) => {
  let output = undefined
  const scope = new Scope()
  Object.entries(scopeEntries).forEach(([key, value]) => {
    scope.set(key, value)
  })
  expect(() => {output = apply(input, scope)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

type NodeLike = Omit<Node, '$from' | '$to'>

const binary = ($label: string, a: NodeLike, b: NodeLike) => ({
  $label, a, b
})

const real = (val: string) => ({'$label': 'REAL', 'value': new Real(val)})
const variable = (name: string) => ({'$label': 'VARIABLE', name})

const add = (a: NodeLike, b: NodeLike) => binary('PLUS', a, b)
const subtract = (a: NodeLike, b: NodeLike) => binary('MINUS', a, b)
const multiply = (a: NodeLike, b: NodeLike) => binary('MULTIPLY', a, b)
const divide = (a: NodeLike, b: NodeLike) => binary('DIVIDE', a, b)
const raise = (a: NodeLike, b: NodeLike) => binary('EXPONENT', a, b)

describe('differentiationVisitor', () => {
  describe('of constants', () => {
    it('returns 0 for any constant', () => {
      expectObject('5', {}, real('0'))
      expectObject(Unicode.infinity, {}, real('0'))
    })
  })

  describe('of variables', () => {
    it('returns 1 if the variable is undefined', () => {
      expectObject('x', {}, real('1'))
    })

    it('returns the derivative of variable if it is defined', () => {
      expectObject('x', {'x': parse('5')}, real('0'))
    })
  })

  describe('of additions', () => {
    it('returns the sum of the derivatives of the parts', () => {
      expectObject('x + 5', {}, add(real('1'), real('0')))
    })
  })

  describe('of subtractions', () => {
    it('returns the difference of the derivatives of the parts', () => {
      expectObject('x - 5', {}, subtract(real('1'), real('0')))
    })
  })

  describe('of multiplications', () => {
    it('returns the product rule of the multiplicands', () => {
      expectObject('5 * x', {}, add(
        multiply(real('0'), variable('x')), 
        multiply(real('5'), real('1'))
      ))
    })
  })

  describe('of divisions', () => {
    it('returns the quotient rule of the parts', () => {
      expectObject('5 / x', {}, divide(
        subtract(
          multiply(real('0'), variable('x')),
          multiply(real('1'), real('5'))
        ),
        raise(variable('x'), real('2'))
      ))
    })
  })
})