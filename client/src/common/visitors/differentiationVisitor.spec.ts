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

const unary = ($label: string) => (expression: NodeLike) => ({$label, expression})
const binary = ($label: string) => (a: NodeLike, b: NodeLike) => ({$label, a, b})

const real = (val: string) => ({'$label': 'REAL', 'value': new Real(val)})
const variable = (name: string) => ({'$label': 'VARIABLE', name})

const add = binary('PLUS')
const subtract = binary('MINUS')
const multiply = binary('MULTIPLY')
const divide = binary('DIVIDE')
const raise = binary('EXPONENT')

const negate = unary('NEGATE')
const ln = unary('LN')

const cos = unary('COS')
const sin = unary('SIN')
const tan = unary('TAN')

const cosh = unary('COSH')
const sinh = unary('SINH')
const tanh = unary('TANH')

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

  describe('of powers and exponentials', () => {
    it('returns the generalized power rule of the parts for powers', () => {
      expectObject('x ^ 2', {}, multiply(
        raise(variable('x'), real('2')),
        add(
          multiply(
            real('1'),
            divide(real('2'), variable('x'))
          ),
          multiply(
            real('0'),
            ln(variable('x'))
          )
        )
      ))
    })

    it('returns the generalized power rule of the parts for exponentials', () => {
      expectObject('2 ^ x', {}, multiply(
        raise(real('2'), variable('x')),
        add(
          multiply(
            real('0'),
            divide(variable('x'), real('2'))
          ),
          multiply(
            real('1'),
            ln(real('2'))
          )
        )
      ))
    })
  })

  describe('of negations', () => {
    it('returns the negation of derivative of the expression', () => {
      expectObject('-x', {}, negate(real('1')))
    })
  })

  describe('of cosines', () => {
    it('returns the chain rule of the derivative of cosine of an expression', () => {
      expectObject('cos(x)', {}, multiply(
        negate(sin(variable('x'))),
        real('1')
      ))
    })
  })

  describe('of sines', () => {
    it('returns the chain rule of the derivative of sine of an expression', () => {
      expectObject('sin(x)', {}, multiply(
        cos(variable('x')),
        real('1')
      ))
    })
  })

  describe('of tangents', () => {
    it('returns the chain rule of the derivative of tangent of an expression', () => {
      expectObject('tan(x)', {}, multiply(
        add(
          real('1'), 
          raise(
            tan(variable('x')), 
            real('2')
          )
        ),
        real('1')
      ))
    })
  })

  describe('of arccosines', () => {
    it('returns the chain rule of the derivative of the arccos', () => {
      expectObject('acos(x)', {}, negate(
        divide(
          real('1'),
          raise(
            subtract(
              real('1'),
              raise(variable('x'), real('2'))
            ),
            real('0.5')
          )
        )
      ))
    })
  })

  describe('of arcsines', () => {
    it('returns the chain rule of the derivative of the arcsin', () => {
      expectObject('asin(x)', {}, divide(
        real('1'),
        raise(
          subtract(
            real('1'), 
            raise(variable('x'), real('2'))),
          real('0.5')
        )
      ))
    })
  })

  describe('of arctangents', () => {
    it('returns the chain rule of the derivative of the arctan', () => {
      expectObject('atan(x)', {}, divide(
        real('1'),
        add(
          real('1'),
          raise(variable('x'), real('2'))
        )
      ))
    })
  })

  describe('of hyperbolic cosines', () => {
    it('returns the chain rule of the derivative of the cosh', () => {
      expectObject('cosh(x)', {}, multiply(
        sinh(variable('x')),
        real('1')
      ))
    })
  })

  describe('of hyperbolic sines', () => {
    it('returns the chain rule of the derivative of the sinh', () => {
      expectObject('sinh(x)', {}, multiply(
        cosh(variable('x')),
        real('1')
      ))
    })
  })

  describe('of hyperbolic tangents', () => {
    it('returns the chain rule of the derivative of the tanh', () => {
      expectObject('tanh(x)', {}, multiply(
        subtract(
          real('1'),
          raise(tanh(variable('x')), real('2'))
        ),
        real('1')
      ))
    })
  })

  describe('of area hyperbolic cosines', () => {
    it('returns the chain rule of the derivative of the acosh', () => {
      expectObject('acosh(x)', {}, divide(
        real('1'),
        raise(
          subtract(
            raise(variable('x'), real('2')),
            real('1')
          ),
          real('0.5')
        )
      ))
    })
  })

  describe('of area hyperbolic sines', () => {
    it('returns the chain rule of the derivative of the asinh', () => {
      expectObject('asinh(x)', {}, divide(
        real('1'),
        raise(
          add(
            real('1'),
            raise(variable('x'), real('2'))
          ),
          real('0.5')
        )
      ))
    })
  })

  describe('of area hyperbolic tangents', () => {
    it('returns the chain rule of the derivative of the atanh', () => {
      expectObject('atanh(x)', {}, divide(
        real('1'),
        subtract(
          real('1'),
          raise(variable('x'), real('2'))
        )
      ))
    })
  })
})