import { parser } from '../parser'
import { Scope } from '../Scope'
import { evaluateVisitor } from './evaluateVisitor'
import { simplifyVisitor } from './simplifyVisitor'
import { 
  NodeLike,
  variable, real, negate,
  multiply, divide, raise
} from './helpers/NodeLike'
import { Unicode } from '../MathSymbols'

const apply = (input: string, context?: Scope) => 
  parser.value(input, {visit: [evaluateVisitor, simplifyVisitor], context})

const expectObject = (input: string, expected: NodeLike) => {
  let output = undefined
  expect(() => {output = apply(input)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe('simplifyVisitor', () => {
  describe('of additions', () => {
    it('returns the non-zero child if either is zero, or zero', () => {
      expectObject('x + 0', variable('x'))
      expectObject('0 + x', variable('x'))
      expectObject('0 + 0', real(0))
    })

    it('chains nested additions', () => {
      expectObject('0 + x + 0', variable('x'))
    })

    it('handles mixed operations', () => {
      expectObject('(0 * (x / 2)) + 5', real(5))
    })

    it('collects like terms', () => {
      expectObject('x + x', multiply(real(2), variable('x')))
    })

    it('collects like terms when the first is a multiplication', () => {
      expectObject('2 * x + x', multiply(real(3), variable('x')))
    })

    it('collects like terms with then second is a multiplication', () => {
      expectObject('x + 2 * x', multiply(real(3), variable('x')))
    })

    it('collects like terms when both are multiplications', () => {
      expectObject('2 * x + 3 * x', multiply(real(5), variable('x')))
    })

    it('collects like terms as multiplications', () => {
      expectObject('x + x + x', multiply(
        real(3), variable('x')
      ))
    })

    it('collects like sub-expressions', () => {
      expectObject('x^2 + x^2', multiply(
        real(2), raise(variable('x'), real(2))
      ))
    })
  })

  describe('of subtractions', () => {
    it('returns the first child if the second is zero', () => {
      expectObject('x - 0', variable('x'))
    })

    it('returns the negation of the second child if the first zero', () => {
      expectObject('0 - x', negate(variable('x')))
    })

    it('chains nested subtractions', () => {
      expectObject('0 - x - 0', negate(variable('x')))
    })
  })

  describe('of multiplications', () => {
    it('returns zero when multiplying by zero', () => {
      expectObject('x * 0', real(0))
      expectObject('0 * x', real(0))
      expectObject('0 * 0', real(0))
    })

    it('returns the non-one child if either is one, or one', () => {
      expectObject('x * 1', variable('x'))
      expectObject('1 * x', variable('x'))
      expectObject('1 * 1', real(1))
    })

    it('chains nested multiplications', () => {
      expectObject('0 * (x * 0)', real(0))
    })

    it('handles mixed operations', () => {
      expectObject('0 * (x / 2)', real(0))
    })
  })

  describe('of divisions', () => {
    it('returns the numerator if the denominator is 1', () => {
      expectObject('x / 1', variable('x'))
    })

    it('returns zero if the numerator is zero', () => {
      expectObject('0 / x', real(0))
    })

    it('returns infinity if the denominator is zero', () => {
      expectObject('x / 0', real(Infinity))
    })
  })

  describe('of exponentiations', () => {
    it('returns zero if the base is zero', () => {
      expectObject('0 ^ x', real(0))
    })

    it('returns one if the base is one', () => {
      expectObject('1 ^ x', real(1))
    })

    it('returns one if the power is zero', () => {
      expectObject('x ^ 0', real(1))
    })

    it('returns the base if the power is one', () => {
      expectObject('x ^ 1', variable('x'))
    })

    it('returns one if both the base and power are zero', () => {
      expectObject('0 ^ 0', real(1))
    })

    it('returns the argument of a binary logarithm power of 2', () => {
      expectObject('2^lb(x)', variable('x'))
    })

    it('returns the argument of a natural logarithm power of e', () => {
      expectObject(`${Unicode.e}^ln(x)`, variable('x'))
    })

    it('returns the argument of a common logarithm power of 10', () => {
      expectObject('10^lg(x)', variable('x'))
    })
  })

  describe('of logarithms', () => {
    it('returns the power of an exponential sub-expression if the base is the same', () => {
      expectObject('lb(2^x)', variable('x'))
      expectObject(`ln(${Unicode.e}^x)`, variable('x'))
      expectObject('lg(10^x)', variable('x'))
    })
  })

  describe('of derivatives', () => {
    it('returns the simplified form of the derivative', () => {
      expectObject(`${Unicode.derivative}(x^2)`, multiply(
        raise(variable('x'), real(2)),
        divide(real(2), variable('x'))
      ))
    })
  })

  describe('by default', () => {
    it('passes through the input node', () => {
      expectObject('x', variable('x'))
    })
  })
})