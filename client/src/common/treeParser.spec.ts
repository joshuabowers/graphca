import { Unicode } from './MathSymbols';
import {
  Tree,
  add, subtract, multiply, divide, negate, raise,
  real, complex, variable,
  lb, ln, lg,
  cos, sin, tan
} from './Tree'
import { treeParser } from "./treeParser";

const expectObject = (input: string, expected: Tree) => {
  let output = undefined
  expect(() => {output = treeParser.value(input)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe('treeParser', () => {
  describe('of constants', () => {
    it('matches reals', () => {
      expectObject('1.2345', real(1.2345))
    })

    it(`matches ${Unicode.e}`, () => {
      expectObject(Unicode.e, real(Math.E))
    })

    it(`matches ${Unicode.pi}`, () => {
      expectObject(Unicode.pi, real(Math.PI))
    })

    it(`matches ${Unicode.infinity}`, () => {
      expectObject(Unicode.infinity, real(Infinity))
    })

    it('matches complex numbers', () => {
      expectObject(`1.23 + 4.56${Unicode.i}`, complex(1.23, 4.56))
    })

    it(`matches ${Unicode.e}${Unicode.i}`, () => {
      expectObject(`${Unicode.e}${Unicode.i}`, complex(0, Math.E))
    })

    it(`matches ${Unicode.pi}${Unicode.i}`, () => {
      expectObject(`${Unicode.pi}${Unicode.i}`, complex(0, Math.PI))
    })
  })

  describe('of variables', () => {
    it('matches identifiers', () => {
      expectObject('x', variable('x'))
    })

    it('does not match reserved words', () => {
      expect(() => treeParser.value('cos')).toThrow()
    })
  })

  describe('of additions', () => {
    it('matches a simple binary', () => {
      expectObject('1.23 + 4.56', add(real(1.23), real(4.56)))
    })

    it('matches nested additions left associatively', () => {
      expectObject('1.23 + 4.56 + 7.89', add(
        add(real(1.23), real(4.56)),
        real(7.89)
      ))
    })
  })

  describe('of subtractions', () => {
    it('matches a simple binary', () => {
      expectObject('1 - 2', subtract(real(1), real(2)))
    })

    it('matches nested subtractions left associatively', () => {
      expectObject('1 - 2 - 3', subtract(
        subtract(real(1), real(2)),
        real(3)
      ))
    })

    it('matches mixed addition and subtraction', () => {
      expectObject('1 + 2 - 3', subtract(
        add(real(1), real(2)),
        real(3)
      ))
    })

    it('matches an alternative symbol for subtraction', () => {
      expectObject(`1 ${Unicode.minus} 2`, subtract(real(1), real(2)))
    })
  })

  describe('of multiplications', () => {
    it('matches a simple binary', () => {
      expectObject('1 * 2', multiply(real(1), real(2)))
    })

    it('matches nested multiplications left associatively', () => {
      expectObject('1 * 2 * 3', multiply(
        multiply(real(1), real(2)),
        real(3)
      ))
    })

    it('has a higher precedence for multiplication over addition', () => {
      expectObject('2 * 3 + 4 * 5', add(
        multiply(real(2), real(3)),
        multiply(real(4), real(5))
      ))
    })

    it('matches an alternative symbol for multiplication', () => {
      expectObject(`2 ${Unicode.multiplication} 3`, multiply(real(2), real(3)))
    })
  })

  describe('of divisions', () => {
    it('matches a simple binary', () => {
      expectObject('1 / 2', divide(real(1), real(2)))
    })

    it('matches nested divisions left associatively', () => {
      expectObject('1 / 2 / 3', divide(
        divide(real(1), real(2)),
        real(3)
      ))
    })

    it('has a higher precedence for division over addition', () => {
      expectObject('1 / 2 + 3 / 4', add(
        divide(real(1), real(2)),
        divide(real(3), real(4))
      ))
    })

    it('has equal precedence to multiplication', () => {
      expectObject('1 / 2 * 3', multiply(
        divide(real(1), real(2)),
        real(3)
      ))
      expectObject('1 * 2 / 3', divide(
        multiply(real(1), real(2)),
        real(3)
      ))
    })

    it('matches an alternative symbol for division', () => {
      expectObject(`1 ${Unicode.division} 2`, divide(real(1), real(2)))
    })
  })

  describe('of exponentiations', () => {
    it('matches a simple binary', () => {
      expectObject('1 ^ 2', raise(real(1), real(2)))
    })

    it('matches nested exponentiations right recursively', () => {
      expectObject('1 ^ 2 ^ 3', raise(
        real(1),
        raise(real(2), real(3))
      ))
    })
  })

  describe('of grouping parentheses', () => {
    it('matches the inner expression', () => {
      expectObject('(1 + 2)', add(real(1), real(2)))
    })

    it('influences associativity', () => {
      expectObject('1 + (2 + 3)', add(
        real(1),
        add(real(2), real(3))
      ))
    })
  })

  describe('of negations', () => {
    it('matches a basic negation', () => {
      expectObject('-1', negate(real(1)))
    })

    it('matches nested negations', () => {
      expectObject('--1', negate(negate(real(1))))
    })

    it('matches an alternative symbol for negations', () => {
      expectObject(`${Unicode.minus}1`, negate(real(1)))
    })
  })

  describe('of logarithms', () => {
    it('matches the binary logarithm', () => {
      expectObject('lb(x)', lb(variable('x')))
    })

    it('matches the natural logarithm', () => {
      expectObject('ln(x)', ln(variable('x')))
    })

    it('matches the common logarithm', () => {
      expectObject('lg(x)', lg(variable('x')))
    })
  })

  describe('of trigonometric functions', () => {
    it('matches cosines', () => {
      expectObject('cos(x)', cos(variable('x')))
    })

    it('matches sines', () => {
      expectObject('sin(x)', sin(variable('x')))
    })

    it('matches tangents', () => {
      expectObject('tan(x)', tan(variable('x')))
    })
  })

  describe('of functions', () => {
    it('matches nested composition', () => {
      expectObject('cos(ln(tan(x)))', cos(ln(tan(variable('x')))))
    })
  })
})
