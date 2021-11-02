import { Unicode } from '../MathSymbols'
import { Complex } from '../fields/Complex'
import { Real } from '../fields/Real'
import { parser } from '../parser'
import { evaluateVisitor } from './evaluateVisitor'
import { createLimitVisitor } from './limitVisitor'
import { Scope } from '../Scope'
import { Node, Location, $node } from 'pegase'

type Asymptote = {[x: string]: number | Real | Complex}

const apply = (input: string, asymptotes: Asymptote, scope: Scope) => parser.value(
  input, {visit: [evaluateVisitor, createLimitVisitor(asymptotes)], context: scope}
)

const real = (val: string) => ({'$label': 'REAL', 'value': new Real(val)})

const location: Location = {index: 0, line: 0, column: 0}

const node = (label: string, fields: Record<string, any>): Node => {
  return {$label: label, $from: location, $to: location, ...fields}
}

const expectObject = (input: string, asymptotes: Asymptote, expected: object) => {
  let output = undefined
  const scope = new Scope()
  expect(() => {output = apply(input, asymptotes, scope)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe('limitVisitor', () => {
  describe('of constants', () => {
    it('is the value of a real', () => {
      expectObject('12.34', {'x': 12.34}, {$label: 'REAL', value: new Real(12.34)})
    })

    it('is the modulus of a complex', () => {
      expectObject(`2 + 3${Unicode.i}`, {'x': new Complex(2,3)}, {
        $label: 'REAL', value: new Real(new Complex(2,3).modulus())
      })
    })
  })

  describe('of variables', () => {
    it('is the value of a real as the variable approaches the real', () => {
      expectObject('x', {'x': 5}, {$label: 'REAL', value: new Real(5)})
    })
  })

  describe('of additions', () => {
    it('is the sum of the limits of the parts', () => {
      expectObject('x + 5', {'x': 7}, {$label: 'PLUS', 'a': real('7'), 'b': real('5')})
    })
  })

  describe('of subtractions', () => {
    it('is the difference of the limits of the parts', () => {
      expectObject('x - 5', {'x': 7}, {$label: 'MINUS', 'a': real('7'), 'b': real('5')})
    })
  })
})