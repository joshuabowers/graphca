import { Unicode } from '../MathSymbols'
import { Complex } from '../fields/Complex'
import { Real } from '../fields/Real'
import { parser } from '../parser'
import { evaluateVisitor } from './evaluateVisitor'
import { createLimitVisitor, Asymptote } from './limitVisitor'
import { Scope } from '../Scope'
import { Node, Location, $node } from 'pegase'

const apply = (input: string, asymptotes: Asymptote, scope: Scope) => parser.value(
  input, {visit: [evaluateVisitor, createLimitVisitor(asymptotes)], context: scope}
)

const real = (val: string) => ({'$label': 'REAL', 'value': new Real(val)})
const infinity = {$label: 'INFINITY'}
const negativeInfinity = {$label: 'NEGATE', 'expression': {$label: 'INFINITY'}}

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

  describe('of multiplications', () => {
    it('is the product of the limits of the parts', () => {
      expectObject('5 * x', {'x': 3}, {$label: 'MULTIPLY', 'a': real('5'), 'b': real('3')})
    })
  })

  describe('of divisions', () => {
    it('is the quotient of the limits of the parts', () => {
      expectObject('5 / x', {'x': 7}, {$label: 'DIVIDE', 'a': real('5'), 'b': real('7')})
    })

    it('is undefined if the limit of the divisor is 0', () => {
      expectObject('5 / x', {'x': 0}, {$label: 'UNDEFINED'})
    })
  })

  describe('of exponentials', () => {
    it('is the power of the limit for a real power', () => {
      expectObject('x ^ 5', {'x': 2}, {$label: 'EXPONENT', 'a': real('2'), 'b': real('5')})
      expectObject('x ^ (1 / 4)', {'x': 2}, {$label: 'EXPONENT', 'a': real('2'), 'b': real('0.25')})
    })

    it('is infinity if the power is negative and even', () => {
      expectObject('x ^ (-2)', {'x': -0}, infinity)
    })

    it('is negative infinity if the power is negative and odd', () => {
      expectObject('x ^ (-3)', {'x': -0}, negativeInfinity)
    })
  })

  describe('of negations', () => {
    it('is the negation of the limit of the expression', () => {
      expectObject('-x', {'x': 2}, {$label: 'NEGATE', 'expression': real('2')})
    })
  })

  describe('of sines', () => {
    it('is the sine of the limit of the expression', () => {
      expectObject('sin(x)', {'x': 5}, {$label: 'SIN', 'expression': real('5')})
    })
  })

  describe('of cosines', () => {
    it('is the cosine of the limit of the expression', () => {
      expectObject('cos(x)', {'x': 5}, {$label: 'COS', 'expression': real('5')})
    })
  })

  describe('of tangents', () => {
    it('is the tangent of the limit of the expression', () => {
      expectObject('tan(x)', {'x': 5}, {$label: 'TAN', 'expression': real('5')})
    })
  })

  describe('of binary logarithms', () => {
    it('is the binary logarithm of the limit of the expression', () => {
      expectObject('lb(x)', {'x': 5}, {$label: 'LB', 'expression': real('5')})
    })
  })

  describe('of natural logarithms', () => {
    it('is the natural logarithm of the limit of the expression', () => {
      expectObject('ln(x)', {'x': 5}, {$label: 'LN', 'expression': real('5')})
    })
  })

  describe('of common logarithms', () => {
    it('is the common logarithm of the limit of the expression', () => {
      expectObject('lg(x)', {'x': 5}, {$label: 'LG', 'expression': real('5')})
    })
  })
})