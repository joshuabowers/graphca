import { match, when } from 'ts-pattern'
import { Unicode } from '../../MathSymbols'
import { Field, Node, Kind, Visitor } from './Field'

const isNegative = when<number, number>(n => n < 0)
const isPositive = when<number, number>(n => n > 0)

export class Complex extends Field<Complex> {
  static NaN = new Complex(Number.NaN, Number.NaN)
  static i = new Complex(0, 1)
  static One = new Complex(1, 0)
  static Zero = new Complex(0, 0)

  readonly $kind = Kind.Complex
  readonly a: number
  readonly b: number

  constructor(a: number | string, b: number | string) {
    super()
    this.a = Number(a)
    this.b = Number(b)
  }

  modulus() {
    return Math.hypot(this.a, this.b)
  }

  argument() {
    return Math.atan2(this.b, this.a)
  }

  toString(): string {
    const symA = (n: number) => this.symbolic(Math.abs(n))
    const symB = (n: number, v = Math.abs(n)) => `${v === 1 ? '' : this.symbolic(v)}${Unicode.i}`
    return match<[number, number], string>([this.a, this.b])
      .with([0, 0], () => '0')
      .with([0, isPositive], ([, b]) => symB(b))
      .with([0, isNegative], ([, b]) => `-${symB(b)}`)
      .with([isPositive, 0], ([a, ]) => symA(a))
      .with([isNegative, 0], ([a, ]) => `-${symA(a)}`)
      .with([isPositive, isNegative], ([a, b]) => `${symA(a)} - ${symB(b)}`)
      .with([isNegative, isNegative], ([a, b]) => `-${symA(a)} - ${symB(b)}`)
      .otherwise(([a, b]) => `${symA(a)} + ${symB(b)}`)
  }

  equals(that: Node): boolean {
    const asComplex = that as Complex
    return super.equals(that)
      && this.a === asComplex.a
      && this.b === asComplex.b
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitComplex(this)
  }

  add(that: Complex) {
    return new Complex(this.a + that.a, this.b + that.b);
  }

  subtract(that: Complex) {
    return new Complex(this.a - that.a, this.b - that.b);
  }

  multiply(that: Complex) {
    return new Complex(
      (this.a * that.a) - (this.b * that.b), 
      (this.a * that.b) + (this.b * that.a)
    )
  }

  divide(that: Complex) {
    const divisor = that.a ** 2 + that.b ** 2
    return new Complex(
      (this.a * that.a + that.b * this.b) / divisor, 
      (that.a * this.b - this.a * that.b) / divisor
    )
  }

  /**
   * Raises the current complex, this, to the power that, such that
   * this ^ that === e ^ (that * z.log())
   * @param that The power to raise the complex number to
   * @returns the principle value of the complex exponentiation, with
   * the b-value constrained.
   */
  raise(that: Complex) {
    const p = this.modulus(), arg = this.argument()
    const dlnp = that.b * Math.log(p), carg = that.a * arg
    const multiplicand = (p ** that.a) * Math.exp(-that.b * arg)
    return new Complex(
      multiplicand * Math.cos(dlnp + carg),
      multiplicand * Math.sin(dlnp + carg)
    )
  }

  negate() {
    return new Complex(-this.a, -this.b)
  }

  cos() {
    return new Complex(
      Math.cos(this.a) * Math.cosh(this.b),
      -Math.sin(this.a) * Math.sinh(this.b)
    )
  }

  sin() {
    return new Complex(
      Math.sin(this.a) * Math.cosh(this.b),
      Math.cos(this.a) * Math.sinh(this.b)
    )
  }

  tan() {
    const divisor = Math.cos(2 * this.a) + Math.cosh(2 * this.b)
    return new Complex(
      Math.sin(2 * this.a) / divisor,
      Math.sinh(2 * this.b) / divisor
    )
  }

  sec() {
    return new Complex(1, 0).divide(this.cos())
  }

  csc() {
    return new Complex(1, 0).divide(this.sin())
  }

  cot() {
    return new Complex(1, 0).divide(this.tan())
  }

  cosh() {
    return new Complex(
      Math.cosh(this.a) * Math.cos(this.b),
      Math.sinh(this.a) * Math.sin(this.b)
    )
  }

  sinh() {
    return new Complex(
      Math.sinh(this.a) * Math.cos(this.b),
      Math.cosh(this.a) * Math.sin(this.b)
    )
  }

  tanh() {
    const divisor = Math.cosh(2 * this.a) + Math.cos(2 * this.b)
    return new Complex(
      Math.sinh(2 * this.a) / divisor,
      Math.sin(2 * this.b) / divisor
    )
  }

  sech() {
    return this.cosh().reciprocal()
  }

  csch() {
    return this.sinh().reciprocal()
  }

  coth() {
    return this.tanh().reciprocal()
  }

  acos() {
    return new Complex(Math.PI / 2, 0).subtract(this.asin())
  }

  asin() {
    const iz = Complex.i.multiply(this)
    const diffSquares = new Complex(1, 0).subtract(this.raise(new Complex(2, 0)))
    const sqrt = diffSquares.raise(new Complex(0.5, 0))
    return Complex.i.multiply(sqrt.subtract(iz).ln())
  }

  atan() {
    const ni2 = new Complex(0, -0.5)
    const inz = Complex.i.subtract(this)
    const ipz = Complex.i.add(this)
    const ratio = inz.divide(ipz)
    return ni2.multiply(ratio.ln())
  }

  asec() {
    return this.reciprocal().acos()
  }

  acsc() {
    return this.reciprocal().asin()
  }

  acot() {
    return new Complex(Math.PI/2, 0).subtract(this.atan())
  }

  acosh() {
    return this.add(
      this.add(Complex.One).raise(new Complex(0.5, 0)).multiply(
        this.subtract(Complex.One).raise(new Complex(0.5, 0))
      )
    ).ln()
  }

  asinh() {
    const z2p1 = this.raise(new Complex(2, 0)).add(Complex.One)
    const sqrt = z2p1.raise(new Complex(0.5, 0))
    const zps = this.add(sqrt)
    return zps.ln()
  }

  atanh() {
    const h = new Complex(0.5, 0)
    const n = Complex.One.add(this)
    const d = Complex.One.subtract(this)
    return h.multiply(n.divide(d).ln())
  }

  asech() {
    const half = new Complex(0.5, 0)
    const r = this.reciprocal()
    const rp1 = r.add(Complex.One).raise(half)
    const rm1 = r.subtract(Complex.One).raise(half)
    return r.add(rp1.multiply(rm1)).ln()
  }

  acsch() {
    const half = new Complex(0.5, 0)
    const r = this.reciprocal()
    const r2 = r.raise(new Complex(2, 0))
    const r2p1 = r2.add(Complex.One).raise(half)
    return r.add(r2p1).ln()
  }

  acoth() {
    const half = new Complex(0.5, 0)
    const n = this.add(Complex.One)
    const d = this.subtract(Complex.One)
    return half.multiply(n.divide(d).ln())
  }

  lb() {
    return this.ln().divide(new Complex(Math.LN2, 0))
  }

  /**
   * Represents a non-periodic evaluation of the complex logarithm.
   * Specifically does not glue all branches together.
   * @returns The principle value of the logarithm, defined within (-pi, pi]
   */
  ln() {
    return new Complex(
      Math.log(this.modulus()),
      this.argument()
    )
  }

  lg() {
    return this.ln().divide(new Complex(Math.LN10, 0))
  }

  factorial() {
    return Complex.NaN
  }

  abs() {
    return new Complex(this.modulus(), 0)
  }

  cast(value: number) {
    return new Complex(value, 0)
  }

  /**
   * Note, this only compares the real part of the complex number.
   * This might need to change to consider the value of abs().
   * @param that a Complex to compare against
   * @returns true if this is less than than
   */
  lt(that: Complex) {
    return this.a < that.a
  }

  isNegative() {
    return this.a < 0
  }

  isInteger() {
    return this.b === 0 && Number.isInteger(this.a)
  }

  isHalfInteger() {
    return this.b === 0 && (Math.abs(this.a) % 1) === 0.5
  }

  reciprocal() {
    return Complex.One.divide(this)
  }
}

export function complex(a: number | string, b: number | string = 0) {
  return new Complex(a, b)
}
