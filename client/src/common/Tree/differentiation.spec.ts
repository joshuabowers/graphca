import { real } from "./real";
import { complex } from "./complex";
import { variable } from "./var";
import { add, subtract } from './addition';
import { multiply, divide, negate } from "./multiplication";
import { raise, square, sqrt, reciprocal } from './exponentiation';
import { lb, ln, lg } from "./logarithmic";
import { abs } from "./absolute";
import { cos, sin, tan, sec, csc, cot } from './trigonometric';
import { acos, asin, atan, asec, acsc, acot } from './arcus';

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

    it('handles subtractions correctly', () => {
      expect(differentiate(subtract(real(1), variable('x')))).toEqual(real(-1))
    })
  })

  describe('of multiplications', () => {
    it('is the sum of the products of the derivatives of the parts', () => {
      expect(differentiate(multiply(real(2), variable('x')))).toEqual(real(2))
    })

    it('handles divisions correctly', () => {
      expect(differentiate(divide(real(5), variable('x')))).toEqual(
        divide(
          real(5),
          square(variable('x'))
        )
      )
    })

    it('returns the negation of derivative of the expression', () => {
      expect(differentiate(negate(variable('x')))).toEqual(real(-1))
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

  describe('of absolute values', () => {
    it('returns the chain rule of the derivative of the absolute', () => {
      expect(differentiate(abs(variable('x')))).toEqual(
        divide(variable('x'), abs(variable('x')))
      )
    })
  })

  describe('of logarithms', () => {
    it('is a chained derivative of the argument and a binary logarithm', () => {
      expect(differentiate(lb(variable('x')))).toEqual(
        divide(
          real(1),
          multiply(variable('x'), ln(real(2)))
        )
      )
    })

    it('is a chained derivative of the argument and a natural logarithm', () => {
      expect(differentiate(ln(variable('x')))).toEqual(
        divide(
          real(1),
          variable('x')
        )
      )
    })

    it('is a chained derivative of the argument and a common logarithm', () => {
      expect(differentiate(lg(variable('x')))).toEqual(
        divide(
          real(1),
          multiply(variable('x'), ln(real(10)))
        )
      )
    })
  })

  describe('of trigonometric functions', () => {
    it('returns the chain rule of the derivative of cosine of an expression', () => {
      expect(differentiate(cos(variable('x')))).toEqual(
        negate(sin(variable('x')))
      )
    })

    it('returns the chain rule of the derivative of sine of an expression', () => {
      expect(differentiate(sin(variable('x')))).toEqual(
        cos(variable('x'))
      )
    })

    it('returns the chain rule of the derivative of tangent of an expression', () => {
      expect(differentiate(tan(variable('x')))).toEqual(
        square(sec(variable('x')))
      )
    })

    it('returns the chain rule of the derivative of the secant', () => {
      expect(differentiate(sec(variable('x')))).toEqual(
        multiply(sec(variable('x')), tan(variable('x')))
      )
    })

    it('returns the chain rule of the derivative of the cosecant', () => {
      expect(differentiate(csc(variable('x')))).toEqual(
        multiply(negate(csc(variable('x'))), cot(variable('x')))
      )
    })

    it('returns the chain rule of the derivative of the cotangent', () => {
      expect(differentiate(cot(variable('x')))).toEqual(
        negate(square(csc(variable('x'))))
      )
    })
  })

  describe('of arcus functions', () => {
    it('returns the chain rule of the derivative of the acos', () => {
      expect(differentiate(acos(variable('x')))).toEqual(
        negate(reciprocal(sqrt(subtract(real(1), square(variable('x'))))))
      )
    })

    it('returns the chain rule of the derivative of the asin', () => {
      expect(differentiate(asin(variable('x')))).toEqual(
        reciprocal(sqrt(subtract(real(1), square(variable('x')))))
      )
    })

    it('returns the chain rule of the derivative of the atan', () => {
      expect(differentiate(atan(variable('x')))).toEqual(
        reciprocal(add(real(1), square(variable('x'))))
      )
    })

    it('returns the chain rule of the derivative of the asec', () => {
      expect(differentiate(asec(variable('x')))).toEqual(
        reciprocal(multiply(
          abs(variable('x')),
          sqrt(subtract(square(variable('x')), real(1)))
        ))
      )
    })

    it('returns the chain rule of the derivative of the acsc', () => {
      expect(differentiate(acsc(variable('x')))).toEqual(
        negate(reciprocal(multiply(
          abs(variable('x')),
          sqrt(subtract(square(variable('x')), real(1)))
        )))
      )
    })

    it('returns the chain rule of the derivative of the acot', () => {
      expect(differentiate(acot(variable('x')))).toEqual(
        negate(reciprocal(add(square(variable('x')), real(1))))
      )
    })
  })

  describe('of hyperbolic functions', () => {

  })

  describe('of area hyperbolic functions', () => {

  })
})
