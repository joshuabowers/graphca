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
  lg,
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
})