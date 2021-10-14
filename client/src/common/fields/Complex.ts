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

  raise(that: Complex) {
    return Complex.NaN
  }

  negate() {
    return new Complex(-this.a, -this.b)
  }

  cos() {
    return Complex.NaN
  }

  sin() {
    return Complex.NaN
  }

  tan() {
    return Complex.NaN
  }

  cosh() {
    return Complex.NaN
  }

  sinh() {
    return Complex.NaN
  }

  tanh() {
    return Complex.NaN
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
    return this.ln().divide(new Complex(Math.log(2)))
  }

  /**
   * Represents a non-periodic evaluation of the complex logarithm.
   * Specifically does not glue all branches together.
   * @returns The principle value of the logarithm, defined within (-pi, pi]
   */
  ln() {
    return new Complex(
      Math.log(this.abs().a),
      Math.atan2(this.b, this.a)
    )
  }

  lg() {
    return this.ln().divide(new Complex(Math.log(10)))
  }

  factorial() {
    return Complex.NaN
  }

  abs() {
    return new Complex(Math.hypot(this.a, this.b))
  }
}