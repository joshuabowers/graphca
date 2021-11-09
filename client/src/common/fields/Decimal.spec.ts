import { Decimal } from "./Decimal";

describe(Decimal, () => {
  describe(Decimal, () => {
    it('accepts numbers, scaling them by precision', () => {
      const d = new Decimal(1.2345)
      expect(d.significand).toEqual(BigInt(1.2345*10**20))
    })

    it('accepts strings, scaling them by precision', () => {
      const d = new Decimal('1.2345')
      expect(d.significand).toEqual(BigInt(1.2345*10**20))
    })

    it('accepts bigints, without scaling them', () => {
      const d = new Decimal(BigInt(5000))
      expect(d.significand).toEqual(BigInt(5000))
    })

    it('accepts negative numbers', () => {
      const d = new Decimal(-5)
      expect(d.significand).toEqual(BigInt(-5*10**20))
      expect(d.significand).toBeLessThan(BigInt(0))
    })

    it('accepts negative fractional numbers', () => {
      const d = new Decimal(-0.1)
      expect(d.significand).toEqual(BigInt(-0.1*10**20))
      expect(d.significand).toBeLessThan(BigInt(0))
    })

    it('accepts strings representing negative numbers', () => {
      const d = new Decimal('-5')
      expect(d.significand).toEqual(BigInt(-5*10**20))
      expect(d.significand).toBeLessThan(BigInt(0))
    })

    it('does not accidentally infinity', () => {
      const d = new Decimal(1)
      expect(d.isFinite).toBe(true)
      expect(d).not.toEqual(Decimal.Infinity)
    })
  })

  describe('Infinity', () => {
    it('equals itself', () => {
      expect(Decimal.Infinity).toEqual(Decimal.Infinity)
    })

    it('does not equal negative infinity', () => {
      expect(Decimal.Infinity).not.toEqual(Decimal.NegativeInfinity)
    })

    it('does not equal 1', () => {
      expect(Decimal.Infinity).not.toEqual(new Decimal(1))
    })
  })

  describe(Decimal.prototype.toString, () => {
    it('outputs without loss of precision', () => {
      const d = new Decimal(1.2345)
      expect(d.toString()).toEqual('1.2345')
    })

    it('outputs a decimal point if the value is fractional', () => {
      const d = new Decimal(0.5)
      expect(d.toString()).toEqual('0.5')
    })

    it('omits the decimal point if the value is whole', () => {
      const d = new Decimal(5)
      expect(d.toString()).toEqual('5')
    })

    it('keeps least significant zeros on wholes', () => {
      const d = new Decimal(1000)
      expect(d.toString()).toEqual('1000')
    })

    it('truncates least significant zeroes past zero point', () => {
      const d = new Decimal('1.23450000')
      expect(d.toString()).toEqual('1.2345')
    })

    it('handles negative values', () => {
      const d = new Decimal('-5')
      expect(d.toString()).toEqual('-5')
    })
  })

  describe(Decimal.prototype.add, () => {
    it('computes whole numbers', () => {
      const a = new Decimal(1), b = new Decimal(2)
      const c = a.add(b)
      expect(c).toEqual(new Decimal(3))
    })

    it('computes fixed point arithmetic', () => {
      const a = new Decimal(0.1), b = new Decimal(0.2)
      const c = a.add(b)
      expect(c).toEqual(new Decimal(0.3))
    })
  })

  describe(Decimal.prototype.subtract, () => {
    it('computes whole numbers', () => {
      const a = new Decimal(1), b = new Decimal(2)
      const c = a.subtract(b)
      expect(c).toEqual(new Decimal(-1))
    })

    it('computes fractional subtraction', () => {
      const a = new Decimal(0.1), b = new Decimal(0.2)
      const c = a.subtract(b)
      expect(c).toEqual(new Decimal(-0.1))
    })

    it('computes fixed point arithmetic', () => {
      const a = new Decimal(0.3), b = new Decimal(0.1)
      const c = a.subtract(b)
      expect(c).toEqual(new Decimal(0.2))
    })
  })

  describe(Decimal.prototype.multiply, () => {
    it('computes for whole numbers', () => {
      const a = new Decimal(2), b = new Decimal(3)
      const c = a.multiply(b)
      expect(c).toEqual(new Decimal(6))
    })

    it('computes for fraction numbers', () => {
      const a = new Decimal(0.1), b = new Decimal(3)
      const c = a.multiply(b)
      expect(c).toEqual(new Decimal(0.3))
    })
  })

  describe(Decimal.prototype.divide, () => {
    it('computes for whole numbers', () => {
      const a = new Decimal(4), b = new Decimal(2)
      const c = a.divide(b)
      expect(c).toEqual(new Decimal(2))
    })

    it('computes for fractional numbers', () => {
      const a = new Decimal(0.5), b = new Decimal(0.25)
      const c = a.divide(b)
      expect(c).toEqual(new Decimal(2))
    })

    it('computes fixed point arithmetic', () => {
      const a = new Decimal(2), b = new Decimal(3)
      const c = a.divide(b)
      expect(c).toEqual(new Decimal('0.66666666666666666666'))
    })

    it('results in infinity when dividing by zero', () => {
      const a = new Decimal(5), b = new Decimal(0)
      const c = a.divide(b)
      expect(c).toEqual(Decimal.Infinity)
    })

    it('results in negative infinity when self is negative and db0', () => {
      const a = new Decimal(-5), b = new Decimal(0)
      const c = a.divide(b)
      expect(c).toEqual(Decimal.NegativeInfinity)
    })

    it('results in zero when dividing by infinity', () => {
      const a = new Decimal(5), b = Decimal.Infinity
      const c = a.divide(b)
      expect(c).toEqual(new Decimal(0))
    })

    it('results in zero when dividing by negative infinity', () => {
      const a = new Decimal(5), b = Decimal.NegativeInfinity
      const c = a.divide(b)
      expect(c).toEqual(new Decimal(0))
    })
  })

  describe(Decimal.prototype.raise, () => {
    it.todo('computes for whole numbers' ) //, () => {
    //   const a = new Decimal(2), b = new Decimal(3)
    //   const c = a.raise(b)
    //   expect(c).toEqual(new Decimal(8))
    // })

    it.todo('computes for fractional numbers') //, () => {
    //   const a = new Decimal(9), b = new Decimal(0.5)
    //   const c = a.raise(b)
    //   expect(c).toEqual(new Decimal(3))
    // })
  })

  describe(Decimal.prototype.negate, () => {
    it('results in a negative value when positive', () => {
      const a = new Decimal(5)
      const c = a.negate()
      expect(c).toEqual(new Decimal(-5))
    })

    it('results in a positive value when negative', () => {
      const a = new Decimal(-5)
      const c = a.negate()
      expect(c).toEqual(new Decimal(5))
    })

    it('results in negative infinity on infinity', () => {
      expect(Decimal.Infinity.negate()).toEqual(Decimal.NegativeInfinity)
    })

    it('results in infinity on negative infinity', () => {
      expect(Decimal.NegativeInfinity.negate()).toEqual(Decimal.Infinity)
    })
  })

  describe(Decimal.prototype.abs, () => {
    it('results in a positive value when negative', () => {
      const a = new Decimal(-5)
      const c = a.abs()
      expect(c).toEqual(new Decimal(5))
    })

    it('results in a positive value when positive', () => {
      const a = new Decimal(5)
      const c = a.abs()
      expect(c).toEqual(new Decimal(5))
    })

    it('results in positive infinity when negative infinity', () => {
      expect(Decimal.NegativeInfinity.abs()).toEqual(Decimal.Infinity)
    })

    it('results in positive infinity when positive infinity', () => {
      expect(Decimal.Infinity.abs()).toEqual(Decimal.Infinity)
    })
  })
})