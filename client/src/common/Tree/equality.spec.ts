import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { add } from './addition'
import { multiply } from './multiplication'
import { raise } from './exponentiation'
import { cos, sin } from './trigonometric'
import { equals } from './equality'

describe(equals, () => {
  describe('of Real', () => {
    it('returns true for two reals with same value', () => {
      expect(equals(real(1), real(1))).toBeTruthy()
    })

    it('returns false for two reals with unequal values', () => {
      expect(equals(real(1), real(2))).toBeFalsy()
    })
  })

  describe('of Complex', () => {
    it('returns true for two complex numbers with same a, b', () => {
      expect(equals(complex(1, 2), complex(1, 2))).toBeTruthy()
    })

    it('returns false for two complex numbers with different a or b', () => {
      expect(equals(complex(1, 2), complex(2, 1))).toBeFalsy()
    })
  })

  describe('of Variables', () => {
    it('returns true for two variables with same name', () => {
      expect(equals(variable('x'), variable('x'))).toBeTruthy()
    })

    it('returns false for two variables with different name', () => {
      expect(equals(variable('y'), variable('x'))).toBeFalsy()
    })
  })

  describe('of Binary functions', () => {
    it('returns true for two binaries with same left, right', () => {
      expect(
        equals(add(variable('x'), real(1)), add(variable('x'), real(1)))
      ).toBeTruthy()
    })

    it('returns false for two binaries with different left, right', () => {
      expect(
        equals(add(variable('x'), real(1)), add(variable('y'), real(2)))
      ).toBeFalsy()
    })

    it('returns false if matching otherwise equal distinct binaries', () => {
      expect(
        equals(
          add(variable('x'), variable('y')), multiply(variable('x'), variable('y'))
        )
      ).toBeFalsy()
    })

    it('returns true for exponentiations', () => {
      expect(
        equals(
          raise(variable('x'), variable('y')), raise(variable('x'), variable('y'))
        )
      )
    })
  })

  describe('of Unary functions', () => {
    it('returns true for two unary functions with same expression', () => {
      expect(
        equals(
          cos(variable('x')), cos(variable('x'))
        )
      ).toBeTruthy()
    })

    it('returns false for two unary functions with different expression', () => {
      expect(
        equals(
          cos(variable('x')), cos(variable('y'))
        )
      ).toBeFalsy()
    })

    it('returns false for two unary functions of different kind', () => {
      expect(
        equals(
          cos(variable('x')), sin(variable('y'))
        )
      ).toBeFalsy()
    })
  })
})
