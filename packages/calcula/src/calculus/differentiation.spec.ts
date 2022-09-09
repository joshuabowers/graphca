import { real } from '../primitives/real';
import { complex } from '../primitives/complex';
import { nil } from '../primitives/nil';
import { nan } from '../primitives/nan';
import { variable } from '../variable';
import { add, subtract } from '../arithmetic/addition';
import { multiply, divide, negate } from '../arithmetic/multiplication';
import { raise, square, sqrt, reciprocal } from '../arithmetic/exponentiation';
import { lb, ln, lg } from '../functions/logarithmic';
import { abs } from '../functions/absolute';
import { cos, sin, tan, sec, csc, cot } from '../functions/trigonometric';
import { acos, asin, atan, asec, acsc, acot } from '../functions/arcus';
import { cosh, sinh, tanh, sech, csch, coth } from '../functions/hyperbolic';
import { acosh, asinh, atanh, asech, acsch, acoth } from '../functions/areaHyperbolic';
import { factorial } from '../functions/factorial';
import { gamma } from '../functions/gamma';
import { polygamma, digamma } from '../functions/polygamma';

import { differentiate } from './differentiation';

describe('differentiate', () => {
  describe('of reals', () => {
    it('is 0', () => {
      expect(differentiate(real(1)).value).toEqual(real(0).value)
    })
  })

  describe('of complex numbers', () => {
    it('is 0', () => {
      expect(differentiate(complex([1, 1])).value).toEqual(complex([0, 0]).value)
    })
  })

  describe('of nil', () => {
    it('is NaN', () => {
      expect(differentiate(nil).value).toEqual(nan.value)
    })
  })

  describe('of variables', () => {
    it('is 1 when unbound', () => {
      expect(differentiate(variable('x')).value).toEqual(real(1).value)
    })
  })

  describe('of additions', () => {
    it('is the sum of the derivatives', () => {
      expect(differentiate(add(variable('x'), real(1))).value).toEqual(real(1).value)
    })

    it('handles subtractions correctly', () => {
      expect(differentiate(subtract(real(1), variable('x'))).value).toEqual(real(-1).value)
    })
  })

  describe('of multiplications', () => {
    it('is the sum of the products of the derivatives of the parts', () => {
      expect(differentiate(multiply(real(2), variable('x'))).value).toEqual(real(2).value)
    })

    it('handles divisions correctly', () => {
      expect(differentiate(divide(real(5), variable('x'))).value).toEqual(
        divide(
          real(-5),
          square(variable('x'))
        ).value
      )
    })

    it('returns the negation of derivative of the expression', () => {
      expect(differentiate(negate(variable('x'))).value).toEqual(real(-1).value)
    })
  })

  describe('of exponentiations', () => {
    it('returns the generalized power rule of the parts for powers', () => {
      expect(differentiate(square(variable('x'))).value).toEqual(
        multiply(real(2), variable('x')).value
      )
    })

    it('returns the generalized power rule of the parts for exponentials', () => {
      expect(differentiate(raise(real(2), variable('x'))).value).toEqual(
        multiply(
          raise(real(2), variable('x')),
          ln(real(2))
        ).value
      )
    })
  })

  describe('of absolute values', () => {
    it('returns the chain rule of the derivative of the absolute', () => {
      expect(differentiate(abs(variable('x'))).value).toEqual(
        divide(variable('x'), abs(variable('x'))).value
      )
    })
  })

  describe('of logarithms', () => {
    it('is a chained derivative of the argument and a binary logarithm', () => {
      expect(differentiate(lb(variable('x'))).value).toEqual(
        divide(
          real(1),
          multiply(variable('x'), ln(real(2)))
        ).value
      )
    })

    it('is a chained derivative of the argument and a natural logarithm', () => {
      expect(differentiate(ln(variable('x'))).value).toEqual(
        divide(
          real(1),
          variable('x')
        ).value
      )
    })

    it('is a chained derivative of the argument and a common logarithm', () => {
      expect(differentiate(lg(variable('x'))).value).toEqual(
        divide(
          real(1),
          multiply(variable('x'), ln(real(10)))
        ).value
      )
    })
  })

  describe('of trigonometric functions', () => {
    it('returns the chain rule of the derivative of cosine of an expression', () => {
      expect(differentiate(cos(variable('x'))).value).toEqual(
        negate(sin(variable('x'))).value
      )
    })

    it('returns the chain rule of the derivative of sine of an expression', () => {
      expect(differentiate(sin(variable('x'))).value).toEqual(
        cos(variable('x')).value
      )
    })

    it('returns the chain rule of the derivative of tangent of an expression', () => {
      expect(differentiate(tan(variable('x'))).value).toEqual(
        square(sec(variable('x'))).value
      )
    })

    it('returns the chain rule of the derivative of the secant', () => {
      expect(differentiate(sec(variable('x'))).value).toEqual(
        multiply(sec(variable('x')), tan(variable('x'))).value
      )
    })

    it('returns the chain rule of the derivative of the cosecant', () => {
      expect(differentiate(csc(variable('x'))).value).toEqual(
        multiply(negate(csc(variable('x'))), cot(variable('x'))).value
      )
    })

    it('returns the chain rule of the derivative of the cotangent', () => {
      expect(differentiate(cot(variable('x'))).value).toEqual(
        negate(square(csc(variable('x')))).value
      )
    })
  })

  describe('of arcus functions', () => {
    it('returns the chain rule of the derivative of the acos', () => {
      expect(differentiate(acos(variable('x'))).value).toEqual(
        negate(reciprocal(sqrt(subtract(real(1), square(variable('x')))))).value
      )
    })

    it('returns the chain rule of the derivative of the asin', () => {
      expect(differentiate(asin(variable('x'))).value).toEqual(
        reciprocal(sqrt(subtract(real(1), square(variable('x'))))).value
      )
    })

    it('returns the chain rule of the derivative of the atan', () => {
      expect(differentiate(atan(variable('x'))).value).toEqual(
        reciprocal(add(real(1), square(variable('x')))).value
      )
    })

    it('returns the chain rule of the derivative of the asec', () => {
      expect(differentiate(asec(variable('x'))).value).toEqual(
        reciprocal(multiply(
          abs(variable('x')),
          sqrt(subtract(square(variable('x')), real(1)))
        )).value
      )
    })

    it('returns the chain rule of the derivative of the acsc', () => {
      expect(differentiate(acsc(variable('x'))).value).toEqual(
        negate(reciprocal(multiply(
          abs(variable('x')),
          sqrt(subtract(square(variable('x')), real(1)))
        ))).value
      )
    })

    it('returns the chain rule of the derivative of the acot', () => {
      expect(differentiate(acot(variable('x'))).value).toEqual(
        negate(reciprocal(add(square(variable('x')), real(1)))).value
      )
    })
  })

  describe('of hyperbolic functions', () => {
    it('returns the chain rule of the derivative of the cosh', () => {
      expect(differentiate(cosh(variable('x'))).value).toEqual(
        sinh(variable('x')).value
      )
    })

    it('returns the chain rule of the derivative of the sinh', () => {
      expect(differentiate(sinh(variable('x'))).value).toEqual(
        cosh(variable('x')).value
      )
    })

    it('returns the chain rule of the derivative of the tanh', () => {
      expect(differentiate(tanh(variable('x'))).value).toEqual(
        square(sech(variable('x'))).value
      )
    })

    it('returns the chain rule of the derivative of the sech', () => {
      expect(differentiate(sech(variable('x'))).value).toEqual(
        multiply(
          negate(tanh(variable('x'))),
          sech(variable('x'))
        ).value
      )
    })

    it('returns the chain rule of the derivative of the csch', () => {
      expect(differentiate(csch(variable('x'))).value).toEqual(
        multiply(
          negate(coth(variable('x'))),
          csch(variable('x'))
        ).value
      )
    })

    it('returns the chain rule of the derivative of the coth', () => {
      expect(differentiate(coth(variable('x'))).value).toEqual(
        negate(square(csch(variable('x')))).value
      )
    })
  })

  describe('of area hyperbolic functions', () => {
    it('returns the chain rule of the derivative of the acosh', () => {
      expect(differentiate(acosh(variable('x'))).value).toEqual(
        reciprocal(sqrt(subtract(square(variable('x')), real(1)))).value
      )
    })

    it('returns the chain rule of the derivative of the asinh', () => {
      expect(differentiate(asinh(variable('x'))).value).toEqual(
        reciprocal(sqrt(add(real(1), square(variable('x'))))).value
      )
    })

    it('returns the chain rule of the derivative of the atanh', () => {
      expect(differentiate(atanh(variable('x'))).value).toEqual(
        reciprocal(subtract(real(1), square(variable('x')))).value
      )
    })

    it('returns the chain rule of the derivative of the asech', () => {
      expect(differentiate(asech(variable('x'))).value).toEqual(
        negate(reciprocal(multiply(
          variable('x'),
          sqrt(subtract(real(1), square(variable('x'))))
        ))).value
      )
    })

    it('returns the chain rule of the derivative of the acsch', () => {
      expect(differentiate(acsch(variable('x'))).value).toEqual(
        negate(reciprocal(multiply(
          abs(variable('x')),
          sqrt(add(real(1), square(variable('x'))))
        ))).value
      )
    })

    it('returns the chain rule of the derivative of the acoth', () => {
      expect(differentiate(acoth(variable('x'))).value).toEqual(
        reciprocal(subtract(real(1), square(variable('x')))).value
      )
    })
  })

  describe('of factorials', () => {
    it('returns the chain rule of the derivative of the factorial', () => {
      expect(
        differentiate(factorial(variable('x'))).value
      ).toEqual(
        multiply(factorial(variable('x')), digamma(add(variable('x'), real(1)))).value
      )
    })
  })

  describe('of gamma', () => {
    it('returns the chain rule of the derivative of gamma', () => {
      expect(
        differentiate(gamma(variable('x'))).value
      ).toEqual(
        multiply(gamma(variable('x')), digamma(variable('x'))).value
      )
    })
  })

  describe('of polygamma', () => {
    it('returns the chain rule of the derivative of the polygamma', () => {
      expect(
        differentiate(polygamma(variable('n'), variable('x'))).value
      ).toEqual(
        polygamma(add(variable('n'), real(1)), variable('x')).value
      )
    })
  })

  describe('of derivatives', () => {
    it('returns the second derivative of the nested expression', () => {
      expect(differentiate(differentiate(cos(variable('x')))).value).toEqual(
        negate(cos(variable('x'))).value
      )
    })
  })

  describe('of orders', () => {
    it('returns the nth derivative of an expression', () => {
      expect(differentiate(real(2), cos(variable('x'))).value).toEqual(
        negate(cos(variable('x'))).value
      )
    })
  })
})
