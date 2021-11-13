import { parser } from '../parser'
import { Scope } from '../Scope'
import { evaluateVisitor } from './evaluateVisitor'
import { simplifyVisitor } from './simplifyVisitor'
import { 
  NodeLike,
  variable, real, negate,
  add, multiply, divide, raise, cos
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

    it('correctly handles the sum of two like multiples', () => {
      expectObject('(x + x) + (x + x)', multiply(
        real(4), variable('x')
      ))
    })

    it('does no simplification if there are no like terms', () => {
      expectObject('2 * x + 3 * y', add(
        multiply(real(2), variable('x')),
        multiply(real(3), variable('y'))
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

    it('returns zero if a quantity is subtracted from itself', () => {
      expectObject('x - x', real(0))
      expectObject('cos(x) - cos(x)', real(0))
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

    it('reorders constants to the left-hand position', () => {
      expectObject('x * 2', multiply(real(2), variable('x')))
      expectObject('2 * x', multiply(real(2), variable('x')))
    })

    it('multiplies a value by the numerator of a division from the left', () => {
      expectObject('x * (y / z)', divide(
        multiply(variable('x'), variable('y')),
        variable('z')
      ))
    })

    it('multiplies a value by the numerator of a division from the right', () => {
      expectObject('(y / z) * x', divide(
        multiply(variable('y'), variable('x')),
        variable('z')
      ))
    })

    it('multiplies two fractions together into a single division', () => {
      expectObject('(x / y) * (z / w)', divide(
        multiply(variable('x'), variable('z')),
        multiply(variable('y'), variable('w'))
      ))
    })

    it('combines like terms as a power', () => {
      expectObject('x * x', raise(variable('x'), real(2)))
    })

    it('combines adds to the power when multiplying by the base from the left', () => {
      expectObject('x * x^2', raise(variable('x'), real(3)))
    })

    it('combines adds to the power when multiplying by the base from the right', () => {
      expectObject('x^2 * x', raise(variable('x'), real(3)))
    })

    it('combines equivalent based powers together', () => {
      expectObject('x^2 * x^3', raise(variable('x'), real(5)))
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

    it('returns one if the numerator and the denominator are the same', () => {
      expectObject('x / x', real(1))
    })

    it('simplifies powers divided by their base', () => {
      expectObject('x^3 / x', raise(variable('x'), real(2)))
    })

    it('simplifies dividing a base by a power of the same base', () => {
      expectObject('x / x^3', divide(
        real(1),
        raise(variable('x'), real(2))
      ))
    })

    it('simplifies powers divided by similar powers', () => {
      expectObject('x^5 / x^3', raise(variable('x'), real(2)))
      expectObject('x^3 / x^2', variable('x'))
      expectObject('x^3 / x^5', divide(
        real(1),
        raise(variable('x'), real(2))
      ))
    })

    it('cancels a multiplicand in the numerator if a similar denominator', () => {
      expectObject('(x * y) / y', variable('x'))
      expectObject('(x * y) / x', variable('y'))
    })

    it('cancels a multiplicand in the denominator if a similar numerator', () => {
      expectObject('y / (x * y)', divide(real(1), variable('x')))
      expectObject('x / (x * y)', divide(real(1), variable('y')))
    })

    it('cancels like terms in a division of multiplications', () => {
      expectObject('(x * y) / (y * z)', divide(variable('x'), variable('z')))
      expectObject('(x * y) / (z * y)', divide(variable('x'), variable('z')))
      expectObject('(x * y) / (x * z)', divide(variable('y'), variable('z')))
      expectObject('(x * y) / (z * x)', divide(variable('y'), variable('z')))
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

    it('returns a reciprocal for negative exponents', () => {
      expectObject('x ^ -5', divide(real(1), raise(variable('x'), real(5))))
    })

    it('returns a reciprocal for negative unaries', () => {
      expectObject('x ^ -cos(x)', divide(
        real(1), raise(variable('x'), cos(variable('x')))
      ))
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
      expectObject('cos(x)', cos(variable('x')))
    })
  })
})