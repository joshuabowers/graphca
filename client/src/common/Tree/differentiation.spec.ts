import { real } from "./real";
import { complex } from "./complex";
import { variable } from "./var";
import { add } from './addition';
import { multiply } from "./multiplication";
import { raise, square } from './exponentiation';
import { ln } from "./logarithmic";

import { differentiate } from "./differentiation";

describe('differentiate', () => {
  describe('of reals', () => {
    it('is 0', () => {
      expect(differentiate(real(1))).toEqual(real(0))
    })
  })

  describe('of complex numbers', () => {
    it('is 0', () => {
      expect(differentiate(complex(1, 1))).toEqual(complex(0, 0))
    })
  })

  describe('of variables', () => {
    it('is 1 when unbound', () => {
      expect(differentiate(variable('x'))).toEqual(real(1))
    })
  })

  describe('of additions', () => {
    it('is the sum of the derivatives', () => {
      expect(differentiate(add(variable('x'), real(1)))).toEqual(real(1))
    })
  })

  describe('of multiplications', () => {
    it('is the sum of the products of the derivatives of the parts', () => {
      expect(differentiate(multiply(real(2), variable('x')))).toEqual(real(2))
    })
  })

  describe('of exponentiations', () => {
    it('returns the generalized power rule of the parts for powers', () => {
      expect(differentiate(square(variable('x')))).toEqual(
        multiply(real(2), variable('x'))
      )
    })

    it('returns the generalized power rule of the parts for exponentials', () => {
      expect(differentiate(raise(real(2), variable('x')))).toEqual(
        multiply(
          raise(real(2), variable('x')),
          ln(real(2))
        )
      )
    })
  })
})
