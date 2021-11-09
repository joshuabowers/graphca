import { Complex } from './Complex'
import { Unicode } from '../MathSymbols'

describe(Complex, () => {
  describe(Complex.prototype.toString, () => {
    it('shows only the real part for pure reals', () => {
      expect(new Complex(5, 0).toString()).toEqual('5')
    })

    it('shows the singleton imaginary without multiplicative constant', () => {
      expect(new Complex(0, 1).toString()).toEqual(Unicode.i)
    })

    it('shows the singleton imaginary in mixed without multiplicative', () => {
      expect(new Complex(2, -1).toString()).toEqual(`2 - ${Unicode.i}`)
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

  describe(Complex.prototype.raise, () => {
    it('calculates the value of raising one complex to another', () => {
      const z = new Complex(0, 1), w = new Complex(0, 1)
      const r = z.raise(w)
      expect(r.a).toBeCloseTo(0.2079, 4)
      expect(r.b).toBeCloseTo(0, 0)
    })

    it('calculates the value of raising a real to a complex number', () => {
      const z = new Complex(-2, 0), w = new Complex(3, 4)
      const r = z.raise(w)
      const m = (-2)**3*Math.exp(-4*Math.PI)
      expect(r.a).toBeCloseTo(m * Math.cos(4 * Math.log(2)), 5)
      expect(r.b).toBeCloseTo(m * Math.sin(4 * Math.log(2)), 5)
    })

    it('calculates the value of raising a complex number to a real', () => {
      const z = new Complex(2, 3), w = new Complex(2, 0)
      const r = z.raise(w)
      const m = z.modulus() ** 2, arg = z.argument()
      expect(r.a).toBeCloseTo(m * Math.cos(2 * arg), 5)
      expect(r.b).toBeCloseTo(m * Math.sin(2 * arg), 5)
    })

    it('calculates the complex square root', () => {
      const z = new Complex(2, 3), w = new Complex(0.5, 0)
      const r = z.raise(w)
      const m = z.modulus() ** 0.5, arg = z.argument()
      expect(r.a).toBeCloseTo(m * Math.cos(0.5 * arg), 5)
      expect(r.b).toBeCloseTo(m * Math.sin(0.5 * arg), 5)
    })
  })

  describe(Complex.prototype.negate, () => {
    it('calculates (-1) * (a + bi)', () => {
      expect(new Complex(2, 3).negate()).toEqual(new Complex(-2, -3))
    })
  })

  describe(Complex.prototype.cos, () => {
    it('calculates the complex trigonometric cos', () => {
      const r = new Complex(2, 3).cos()
      expect(r.a).toBeCloseTo(Math.cos(2) * Math.cosh(3), 5)
      expect(r.b).toBeCloseTo(-Math.sin(2) * Math.sinh(3), 5)
    })
  })

  describe(Complex.prototype.sin, () => {
    it('calculates the complex trigonometric sin', () => {
      const r = new Complex(2, 3).sin()
      expect(r.a).toBeCloseTo(Math.sin(2) * Math.cosh(3), 5)
      expect(r.b).toBeCloseTo(Math.cos(2) * Math.sinh(3), 5)
    })
  })

  describe(Complex.prototype.tan, () => {
    it('calculates the complex trigonometric tan', () => {
      const r = new Complex(2, 3).tan()
      const d = Math.cos(4) + Math.cosh(6)
      expect(r.a).toBeCloseTo(Math.sin(4) / d, 5)
      expect(r.b).toBeCloseTo(Math.sinh(6) / d, 5)
    })
  })

  describe(Complex.prototype.cosh, () => {
    it('calculates the complex hyperbolic cos', () => {
      const z = new Complex(2, 3)
      const r = z.cosh()
      expect(r.a).toBeCloseTo(Math.cosh(2) * Math.cos(3), 5)
      expect(r.b).toBeCloseTo(Math.sinh(2) * Math.sin(3), 5)
    })
  })

  describe(Complex.prototype.sinh, () => {
    it('calculates the complex hyperbolic sin', () => {
      const z = new Complex(2, 3)
      const r = z.sinh()
      expect(r.a).toBeCloseTo(Math.sinh(2) * Math.cos(3), 5)
      expect(r.b).toBeCloseTo(Math.cosh(2) * Math.sin(3), 5)
    })
  })

  describe(Complex.prototype.tanh, () => {
    it('calculates the complex hyperbolic tan', () => {
      const z = new Complex(2, 3)
      const r = z.tanh()
      const d = Math.cosh(4) + Math.cos(6)
      expect(r.a).toBeCloseTo(Math.sinh(4) / d, 5)
      expect(r.b).toBeCloseTo(Math.sin(6) / d, 5)
    })
  })

  // NOTE: for the complex arcus functions, the implementations are done
  // in terms of mathematical functions on the complex number as a
  // discrete entity, not as mathematical operations on the components
  // of that complex number. So, the expected values represent calculated
  // values found elsewhere for comparison.
  describe(Complex.prototype.acos, () => {
    it('calculates the complex arcus cos', () => {
      const z = new Complex(2, 3)
      const r = z.acos()
      expect(r.a).toBeCloseTo(1.000144, 6)
      expect(r.b).toBeCloseTo(-1.983387, 6)
    })
  })

  describe(Complex.prototype.asin, () => {
    it('calculates the complex arcus sin', () => {
      const z = new Complex(2, 3)
      const r = z.asin()
      expect(r.a).toBeCloseTo(0.570653, 6)
      expect(r.b).toBeCloseTo(1.983387, 6)
    })
  })

  describe(Complex.prototype.atan, () => {
    it('calculates the complex arcus tan', () => {
      const z = new Complex(2, 3)
      const r = z.atan()
      expect(r.a).toBeCloseTo(1.409921, 6)
      expect(r.b).toBeCloseTo(0.229073, 6)
    })
  })

  describe(Complex.prototype.acosh, () => {
    it('calculates the complex area hyperbolic cos', () => {
      const z = new Complex(2, 3)
      const r = z.acosh()
      expect(r.a).toBeCloseTo(1.983387, 6)
      expect(r.b).toBeCloseTo(1.000144, 6)
    })
  })

  describe(Complex.prototype.asinh, () => {
    it('calculates the complex area hyperbolic sin', () => {
      const z = new Complex(2, 3)
      const r = z.asinh()
      expect(r.a).toBeCloseTo(1.968638, 6)
      expect(r.b).toBeCloseTo(0.964659, 6)
    })
  })

  describe(Complex.prototype.atanh, () => {
    it('calculates the complex area hyperbolic tan', () => {
      const z = new Complex(2, 3)
      const r = z.atanh()
      expect(r.a).toBeCloseTo(0.146947, 6)
      expect(r.b).toBeCloseTo(1.338973, 6)
    })
  })

  describe(Complex.prototype.lb, () => {
    it('calculates the principle value of the complex logarithm divided by ln(2)', () => {
      const r = new Complex(0, -3).lb()
      expect(r.a).toBeCloseTo(Math.log(3) / Math.log(2), 5)
      expect(r.b).toBeCloseTo((Math.PI / -2) / Math.log(2), 5)
    })
  })

  describe(Complex.prototype.ln, () => {
    it('calculates the principle value of the complex', () => {
      const r = new Complex(0, -3).ln()
      expect(r.a).toBeCloseTo(Math.log(3), 5)
      expect(r.b).toBeCloseTo(Math.PI / -2, 5)
    })
  })

  describe(Complex.prototype.lg, () => {
    it('calculates the principle value of the complex logarithm divided by ln(10)', () => {
      const r = new Complex(0, -3).lg()
      expect(r.a).toBeCloseTo(Math.log(3) / Math.log(10), 5)
      expect(r.b).toBeCloseTo((Math.PI / -2) / Math.log(10), 5)
    })
  })

  describe(Complex.prototype.factorial, () => {
    it.todo('calculates the complex factorial in terms of the gamma function')
  })

  describe(Complex.prototype.abs, () => {
    it('calculates the magnitude of the real and imaginary part', () => {
      expect(new Complex(2, 3).abs().a).toBeCloseTo(Math.sqrt(13), 5)
    })
  })

  describe(Complex.prototype.cast, () => {
    it('converts a Number into a Complex', () => {
      const n = 5.5
      const r = Complex.i.cast(n)
      expect(r.a).toEqual(n)
      expect(r.b).toEqual(0)
    })
  })

  describe(Complex.prototype.lt, () => {
    it('is true if this is less than that', () => {
      const a = new Complex(2), b = new Complex(3)
      expect(a.lt(b)).toBe(true)
    })

    it('is false if this is greater than that', () => {
      const a = new Complex(3), b = new Complex(2)
      expect(a.lt(b)).toBe(false)
    })
  })

  describe(Complex.prototype.isNegative, () => {
    it('is true if the real part is less than zero', () => {
      const a = new Complex(-5)
      expect(a.isNegative()).toBe(true)
    })

    it('is false if the real part is greater than or equal to zero', () => {
      const a = new Complex(5)
      expect(a.isNegative()).toBe(false)
    })
  })

  describe(Complex.prototype.isInteger, () => {
    it('is true if the real part is integer and the imaginary is zero', () => {
      const a = new Complex(5)
      expect(a.isInteger()).toBe(true)
    })

    it('is false if the imaginary part is nonzero', () => {
      const a = new Complex(5, 1)
      expect(a.isInteger()).toBe(false)
    })

    it('is false if the real part is non-integer', () => {
      const a = new Complex(5.5)
      expect(a.isInteger()).toBe(false)
    })
  })

  describe(Complex.prototype.gamma, () => {
    it('calculates the gamma function for complex numbers', () => {
      const z = new Complex(2, 3)
      const r = z.gamma()
      expect(r.a).toBeCloseTo(-0.08239527, 8)
      expect(r.b).toBeCloseTo(0.09177429, 8)
    })

    it('handles negative imaginary numbers', () => {
      const z = new Complex(1, -1)
      const r = z.gamma()
      expect(r.a).toBeCloseTo(0.498, 3)
      expect(r.b).toBeCloseTo(0.155, 3)
    })
  })
})