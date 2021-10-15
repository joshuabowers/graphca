import { Field } from "./Field";
import { Unicode } from "../MathSymbols";

const nIfNot1 = (n: number, sign: boolean = false) => {
  return ((n === 1 || n === -1)
    ? (
      (sign && n === -1) ? '-' : undefined
    ): n)
}

export class Complex extends Field<Complex> {
  static NaN = new Complex(Number.NaN)

  a: number;
  b: number;

  constructor(a: number, b: number = 0) {
    super()
    this.a = a;
    this.b = b;
  }

  modulus() {
    return Math.hypot(this.a, this.b)
  }

  argument() {
    return Math.atan2(this.b, this.a)
  }

  toString() {
    const result: any[] = [];
    if(this.a !== 0) result.push(this.a)
    if(result.length > 0){
      if(this.b < 0 ) result.push(' - ', nIfNot1(Math.abs(this.b)), Unicode.i)
      else if(this.b > 0) result.push(' + ', nIfNot1(this.b), Unicode.i)
    } else {
      if(this.b !== 0) result.push(nIfNot1(this.b, true), Unicode.i)
      else result.push(0)
    }
    return result.join('');
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

  acos() {
    return Complex.NaN
  }

  asin() {
    return Complex.NaN
  }

  atan() {
    return Complex.NaN
  }

  acosh() {
    return Complex.NaN
  }

  asinh() {
    return Complex.NaN
  }

  atanh() {
    return Complex.NaN
  }

  lb() {
    return this.ln().divide(new Complex(Math.LN2))
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
    return this.ln().divide(new Complex(Math.LN10))
  }

  factorial() {
    return Complex.NaN
  }

  abs() {
    return new Complex(this.modulus())
  }
}