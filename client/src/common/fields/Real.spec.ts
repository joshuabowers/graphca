import { Unicode } from "../MathSymbols";
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

  describe(Real.prototype.lg, () => {
    it('calculates the base-2 logarithm of the real', () => {
      expect(new Real(1024).lg()).toEqual(new Real(10))
    })
  })

  describe(Real.prototype.ln, () => {
    it('calculates the natural logarithm of the real', () => {
      const eCubed = Real.E.raise(new Real(3))
      expect(eCubed.ln().value).toBeCloseTo(3)
    })
  })

  describe(Real.prototype.log, () => {
    it('calculates the base-10 logarithm of the real', () => {
      expect(new Real(1000).log()).toEqual(new Real(3))      
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

  describe('As a field', () => {
    it('still works', () => {
      const f: Field<any> = new Real(2), s: Field<any> = new Real(3);
      const r = f.add(s)
      expect(r).toEqual(new Real(5))
    })
  })
})