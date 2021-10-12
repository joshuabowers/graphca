import { Complex } from './Complex'
import { Unicode } from '../MathSymbols'

describe(Complex, () => {
  describe(Complex.prototype.toString, () => {
    it('shows only the real part for pure reals', () => {
      expect(new Complex(5, 0).toString()).toEqual('5')
    })

    it('shows on the imaginary part for pure imaginaries', () => {
      expect(new Complex(0, 5).toString()).toEqual(`5${Unicode.i}`)
    })

    it('shows both real and imaginary for mixed complex numbers', () => {
      expect(new Complex(1, 2).toString()).toEqual(`1 + 2${Unicode.i}`)
    })

    it('converts negative imaginary parts to subtractions', () => {
      expect(new Complex(1, -2).toString()).toEqual(`1 - 2${Unicode.i}`)
    })

    it('correctly applies a negation sign for pure imaginaries', () => {
      expect(new Complex(0, -2).toString()).toEqual(`-2${Unicode.i}`)
    })

    it('handles 0 correctly', () => {
      expect(new Complex(0, 0).toString()).toEqual('0')
    })
  })

  describe(Complex.prototype.add, () => {
    it('computes a new complex immutably', () => {
      const f = new Complex(1, 2), s = new Complex(0, 0);
      const r = f.add(s)
      expect(f).not.toBe(r)
      expect(s).not.toBe(r)
    })

    it('combines the real and imaginary parts separately', () => {
      const f = new Complex(1, 2), s = new Complex(2, 3);
      const r = f.add(s)
      expect(r).toEqual(new Complex(3,5))
    })
  })

  describe(Complex.prototype.subtract, () => {
    it('collects like terms', () => {
      const f = new Complex(1, 2), s = new Complex(2, 3);
      const r = f.subtract(s)
      expect(r).toEqual(new Complex(-1, -1))
    })
  })

  describe(Complex.prototype.multiply, () => {
    it('uses the distributive property to compute', () => {
      const f = new Complex(2, 3), s = new Complex(5, 7);
      const r = f.multiply(s)
      expect(r).toEqual(new Complex(-11, 29))
    })
  })

  describe(Complex.prototype.divide, () => {
    it('uses the principles of complex conjugates and distributivity', () => {
      const f = new Complex(2, 3), s = new Complex(4, 5);
      const r = f.divide(s)
      expect(r).toEqual(new Complex(0.5609756097560976, 0.04878048780487805))
    })
  })
})