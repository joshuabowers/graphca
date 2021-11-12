import { identityParser } from "./identityParser";
import { Unicode } from "./MathSymbols";
import { 
  NodeLike,
  real, complex, variable,
  add, subtract, multiply, divide, raise, negate,
  cos, sin, tan,
  acos, asin, atan,
  cosh, sinh, tanh,
  acosh, asinh, atanh,
  lb, ln, lg,
  gamma, digamma, factorial, abs,
  assign, invoke, differentiate
} from './visitors/helpers/NodeLike'

const expectObject = (input: string, expected: NodeLike) => {
  let output = undefined
  expect(() => {output = identityParser.value(input)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe('identityParser', () => {
  describe('of constants', () => {
    it('matches reals', () => {
      expectObject('10.234', real(10.234))
    })

    it('matches complexes', () => {
      expectObject(`1.23 + 4.56${Unicode.i}`, complex(1.23, 4.56))
    })

    it('matches zero-real complex numbers', () => {
      expectObject(`4.56${Unicode.i}`, complex(0, 4.56))
    })

    it('matches singleton imaginary numbers', () => {
      expectObject(Unicode.i, complex(0, 1))
    })

    it('matches complex numbers with a singleton imaginary', () => {
      expectObject(`1.23 + ${Unicode.i}`, complex(1.23, 1))
    })

    it('matches e', () => {
      expectObject(Unicode.e, real(Math.E))
    })
  })

  describe('of variables', () => {
    it('matches identifiers', () => {
      expectObject('x', variable('x'))
    })
  })

  describe('of additions', () => {
    it('matches the degenerate case', () => {
      expectObject('x + y', add(variable('x'), variable('y')))
    })

    it('matches chained additions', () => {
      expectObject('x + y + z', add(
        add(variable('x'), variable('y')),
        variable('z')
      ))
    })

    it('simplifies adding zero on the right', () => {
      expectObject('x + 0', variable('x'))
    })

    it('simplifies adding zero on the left', () => {
      expectObject('0 + x', variable('x'))
    })

    it('reduces multiple zeros', () => {
      expectObject('0 + x + 0', variable('x'))
    })
  })

  describe('of subtractions', () => {
    it('matches the degenerate case', () => {
      expectObject('x - y', subtract(variable('x'), variable('y')))
    })

    it('matches chained subtractions', () => {
      expectObject('x - y - z', subtract(
        subtract(variable('x'), variable('y')),
        variable('z')
      ))
    })

    it('simplifies subtracting zero on the right', () => {
      expectObject('x - 0', variable('x'))
    })

    it('simplifies subtracting from zero on the left', () => {
      expectObject('0 - x', negate(variable('x')))
    })

    it('reduces multiple zeros', () => {
      expectObject('0 - x - 0', negate(variable('x')))
    })
  })

  describe('of multiplications', () => {
    it('matches the degenerate case', () => {
      expectObject('x * y', multiply(variable('x'), variable('y')))
    })

    it('matches chained multiplications', () => {
      expectObject('x * y * z', multiply(
        multiply(variable('x'), variable('y')),
        variable('z')
      ))
    })

    it('simplifies multiplying by zero on the right', () => {
      expectObject('x * 0', real(0))
    })

    it('simplifies multiplying by zero on the left', () => {
      expectObject('0 * x', real(0))
    })

    it('reduces multiple zeros', () => {
      expectObject('0 * x * 0', real(0))
    })

    it('reduces nested zeros', () => {
      expectObject('x * y * 0', real(0))
    })

    it('simplifies multiplying by one on the right', () => {
      expectObject('x * 1', variable('x'))
    })

    it('simplifies multiplying by one on the left', () => {
      expectObject('1 * x', variable('x'))
    })

    it('reduces multiple ones', () => {
      expectObject('1 * x * 1', variable('x'))
    })

    it('reduces nested ones', () => {
      expectObject('x * y * 1', multiply(variable('x'), variable('y')))
    })
  })

  describe('of divisions', () => {
    it('matches the degenerate case', () => {
      expectObject('x / y', divide(variable('x'), variable('y')))
    })

    it('matches chained divisions', () => {
      expectObject('x / y / z', divide(
        divide(variable('x'), variable('y')),
        variable('z')
      ))
    })

    it('simplifies dividing zero by anything else', () => {
      expectObject('0 / x', real(0))
    })

    it('simplifies dividing anything by zero', () => {
      expectObject('x / 0', real(Infinity))
    })

    it('simplifies dividing by one', () => {
      expectObject('x / 1', variable('x'))
    })

    it('reduces nested zeros', () => {
      expectObject('x / y / 0', real(Infinity))
    })

    it('reduces nested ones', () => {
      expectObject('x / y / 1', divide(variable('x'), variable('y')))
    })
  })

  describe('of powers', () => {
    it('matches the degenerate case', () => {
      expectObject('x ^ y', raise(variable('x'), variable('y')))
    })

    it('matches chained powers', () => {
      expectObject('x ^ y ^ z', raise(
        variable('x'),
        raise(variable('y'), variable('z'))
      ))
    })

    it('simplifies a power of zero', () => {
      expectObject('x ^ 0', real(1))
    })

    it('simplifies a power of oen', () => {
      expectObject('x ^ 1', variable('x'))
    })

    it('simplifies a base of zero', () => {
      expectObject('0 ^ x', real(0))
    })

    it('simplifies a base of one', () => {
      expectObject('1 ^ x', real(1))
    })

    it('reduces nested zeros', () => {
      expectObject('x ^ y ^ 0', variable('x'))
    })

    it('reduces nested ones', () => {
      expectObject('x ^ y ^ 1', raise(variable('x'), variable('y')))
    })

    it('simplifies a binary power of a binary logarithm', () => {
      expectObject('2 ^ lb(x)', variable('x'))
    })

    it('simplifies a natural power of a natural logarithm', () => {
      expectObject(`${Unicode.e} ^ ln(x)`, variable('x'))
    })

    it('simplifies a common power of a common logarithm', () => {
      expectObject('10 ^ lg(x)', variable('x'))
    })
  })

  describe('of logarithms', () => {
    it('matches the degenerate cases', () => {
      expectObject('lb(x)', lb(variable('x')))
      expectObject('ln(x)', ln(variable('x')))
      expectObject('lg(x)', lg(variable('x')))
    })

    it('simplifies the binary logarithm of a binary power', () => {
      expectObject('lb(2^x)', variable('x'))
    })

    it('simplifies the natural logarithm of a natural power', () => {
      expectObject(`ln(${Unicode.e}^x)`, variable('x'))
    })

    it('simplifies the common logarithm of a common power', () => {
      expectObject('lg(10^x)', variable('x'))
    })
  })
})