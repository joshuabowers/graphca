import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { add } from './addition'
import { multiply } from './multiplication'
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
  })

  describe('of Unary functions', () => {
    it.todo('returns true for two unaries with same expression')
    it.todo('returns false for two unaries with different expression')
  })
})
