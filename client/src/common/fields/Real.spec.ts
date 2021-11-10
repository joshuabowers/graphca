import { Unicode } from "../MathSymbols";
import { Complex } from "./Complex";
import { Field } from "./Field";
import { Real } from "./Real";

describe(Real, () => {
  describe(Real.prototype.toString, () => {
    it('handles positive numbers', () => {
      expect(new Real(5).toString()).toEqual('5')
    })

    it('handles 0', () => {
      expect(Real.Zero.toString()).toEqual('0')
    })

    it('handles negative numbers', () => {
      expect(new Real(-5).toString()).toEqual('-5')
    })

    it('handles infinity', () => {
      expect(Real.Infinity.toString()).toEqual(Unicode.infinity)
    })
  })

  describe(Real.prototype.add, () => {
    it('performs real addition', () => {
      const f = new Real(2), s = new Real(3);
      const r = f.add(s)
      expect(r).toEqual(new Real(5))
    })
  })

  describe(Real.prototype.subtract, () => {
    it('performs real subtraction', () => {
      const f = new Real(2), s = new Real(3);
      const r = f.subtract(s)
      expect(r).toEqual(new Real(-1))
    })
  })

  describe(Real.prototype.multiply, () => {
    it('performs real multiplication', () => {
      const f = new Real(2), s = new Real(3);
      const r = f.multiply(s)
      expect(r).toEqual(new Real(6))
    })
  })

  describe(Real.prototype.divide, () => {
    it('performs real division', () => {
      const f = new Real(6), s = new Real(3);
      const r = f.divide(s)
      expect(r).toEqual(new Real(2))
    })
  })

  describe(Real.prototype.raise, () => {
    it('performs real exponentiation', () => {
      const f = new Real(2), s = new Real(10);
      const r = f.raise(s)
      expect(r).toEqual(new Real(1024))
    })
  })

  describe(Real.prototype.negate, () => {
    it('performs real negation', () => {
      expect(new Real(2).negate()).toEqual(new Real(-2))
    })

    it('handles infinity correctly', () => {
      expect(Real.Infinity.negate()).toEqual(new Real(Number.NEGATIVE_INFINITY))
    })
  })

  describe(Real.prototype.cos, () => {
    it('calculates the trigonometric cos on the real', () => {
      expect(Real.PI.cos()).toEqual(new Real(-1))
    })
  })

  describe(Real.prototype.sin, () => {
    it('calculates the trigonometric sin on the real', () => {
      expect(Real.PI.sin().value).toBeCloseTo(0)
    })
  })

  describe(Real.prototype.tan, () => {
    it('calculates the trigonometric tan on the real', () => {
      const quarterPi = Real.PI.divide(new Real(4))
      expect(quarterPi.tan().value).toBeCloseTo(1)
    })
  })

  describe(Real.prototype.cosh, () => {
    it('calculates the hyperbolic cos on the real', () => {
      expect(Real.Zero.cosh().value).toBeCloseTo(1, 5)
    })
  })

  describe(Real.prototype.sinh, () => {
    it('calculates the hyperbolic sin on the real', () => {
      expect(Real.Zero.sinh().value).toBeCloseTo(0, 5)
    })
  })

  describe(Real.prototype.tanh, () => {
    it('calculates the hyperbolic tan on the real', () => {
      expect(Real.Zero.tanh().value).toBeCloseTo(0, 5)
    })
  })

  describe(Real.prototype.acos, () => {
    it('calculates the arcus cos of the real', () => {
      expect(new Real(-1).acos().value).toBeCloseTo(Real.PI.value, 5)
    })
  })

  describe(Real.prototype.asin, () => {
    it('calculates the arcus sin of the real', () => {
      expect(new Real(0).asin().value).toBeCloseTo(0, 5)
    })
  })

  describe(Real.prototype.atan, () => {
    it('calculates the arcus tan of the real', () => {
      const quarterPi = Real.PI.divide(new Real(4))
      expect(new Real(1).atan().value).toBeCloseTo(quarterPi.value, 5)
    })
  })

  describe(Real.prototype.acosh, () => {
    it('calculates the area hyperbolic cos on the real', () => {
      expect(new Real(1).acosh().value).toBeCloseTo(0, 5)
    })
  })

  describe(Real.prototype.asinh, () => {
    it('calculates the area hyperbolic sin on the real', () => {
      expect(new Real(0).asinh().value).toBeCloseTo(0, 5)
    })
  })

  describe(Real.prototype.atanh, () => {
    it('calculates the area hyperbolic tan on the real', () => {
      expect(new Real(0).atanh().value).toBeCloseTo(0, 5)
    })
  })

  describe(Real.prototype.lb, () => {
    it('calculates the base-2 logarithm of the real', () => {
      expect(new Real(1024).lb()).toEqual(new Real(10))
    })
  })

  describe(Real.prototype.ln, () => {
    it('calculates the natural logarithm of the real', () => {
      const eCubed = Real.E.raise(new Real(3))
      expect(eCubed.ln().value).toBeCloseTo(3)
    })
  })

  describe(Real.prototype.lg, () => {
    it('calculates the base-10 logarithm of the real', () => {
      expect(new Real(1000).lg()).toEqual(new Real(3))      
    })
  })

  describe(Real.prototype.factorial, () => {
    it('results in NaN for negative reals', () => {
      expect(new Real(-1).factorial()).toEqual(Real.NaN)
    })

    it('results in 1 for a real of 0', () => {
      expect(Real.Zero.factorial()).toEqual(new Real(1))
    })

    it('computes the real multiplied by one less than the real', () => {
      expect(new Real(5).factorial()).toEqual(new Real(120))
    })
  })

  describe(Real.prototype.abs, () => {
    it('provides the positive magnitude of the real', () => {
      expect(new Real(-10).abs()).toEqual(new Real(10))
    })
  })

  describe(Real.prototype.cast, () => {
    it('converts a Number into a Real', () => {
      const n = 5.5, r = Real.Zero;
      expect(r.cast(5.5).value).toEqual(n)
    })
  })

  describe(Real.prototype.lt, () => {
    it('is true if this is less than that', () => {
      const a = new Real(2), b = new Real(3)
      expect(a.lt(b)).toBe(true)
    })

    it('is false if this is greater than that', () => {
      const a = new Real(3), b = new Real(2)
      expect(a.lt(b)).toBe(false)
    })
  })

  describe(Real.prototype.isNegative, () => {
    it('is true if this is less than zero', () => {
      const a = new Real(-5)
      expect(a.isNegative()).toBe(true)
    })

    it('is false if this is greater than or equal to zero', () => {
      const a = new Real(5)
      expect(a.isNegative()).toBe(false)
      expect(Real.Zero.isNegative()).toBe(false)
    })
  })

  describe(Real.prototype.isInteger, () => {
    it('is true if this is an integer', () => {
      const a = new Real(5)
      expect(a.isInteger()).toBe(true)
    })

    it('is false if this is real', () => {
      const a = new Real(5.5)
      expect(a.isInteger()).toBe(false)
    })
  })

  describe(Real.prototype.isHalfInteger, () => {
    it('is true if this is half way between two integers', () => {
      const a = new Real(5.5)
      expect(a.isHalfInteger()).toBe(true)
    })

    it('is true for negative half integers', () => {
      const a = new Real(-5.5)
      expect(a.isHalfInteger()).toBe(true)
    })

    it('is false if this is integer', () => {
      const a = new Real(5)
      expect(a.isHalfInteger()).toBe(false)
    })

    it('is false for non-half reals', () => {
      const a = new Real(5.25)
      expect(a.isHalfInteger()).toBe(false)
    })
  })

  describe(Real.prototype.gamma, () => {
    it('calculates (n-1)! for positive integers', () => {
      expect(new Real(5).gamma().value).toBeCloseTo(24, 8)
    })

    it.todo('is undefined for non-positive integers')
    // , () => {
    //   expect(new Real(-5).gamma().value).toBeUndefined()
    // }

    it('calculates the gamma function for real values', () => {
      expect(new Real(5.5).gamma().value).toBeCloseTo(52.34277778, 8)
    })

    it('calculates values lower than 0.5 via reflection', () => {
      expect(new Real(0.25).gamma().value).toBeCloseTo(3.62560991, 8)
    })
  })

  describe(Real.prototype.digamma, () => {
    it('uses a reflection formula for inputs less than 0', () => {
      expect(new Real(-5.5).digamma().value).toBeCloseTo(1.79291133039993294, 2)
    })

    it('users a recurrence formula to find values smaller than large', () => {
      expect(new Real(1.75).digamma().value).toBeCloseTo(0.24747245354686, 2)
    })

    it('for large values, uses an approximation on Bernoulli numbers', () => {
      expect(new Real(100).digamma().value).toBeCloseTo(4.600161852738087, 2)
    })

    it('approximates Euler-Mascheroni at 1', () => {
      expect(new Real(1).digamma().value).toBeCloseTo(Real.Euler.negate().value, 2)
    })
  })

  describe('As a field', () => {
    it('still works', () => {
      const f: Field<any> = new Real(2), s: Field<any> = new Real(3);
      const r = f.add(s)
      expect(r).toEqual(new Real(5))
    })
  })
})