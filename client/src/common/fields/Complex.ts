import { Field } from "./Field";
import { Unicode } from "../MathSymbols";

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
    if(this.a != 0) result.push(this.a)
    if(result.length > 0){
      if(this.b < 0 ) result.push(' - ', Math.abs(this.b), Unicode.i)
      else if(this.b > 0) result.push(' + ', this.b, Unicode.i)
    } else {
      if(this.b != 0) result.push(this.b, Unicode.i)
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

  acos() {
    return Complex.NaN
  }

  asin() {
    return Complex.NaN
  }

  atan() {
    return Complex.NaN
  }

  lg() {
    return Complex.NaN
  }

  ln() {
    return Complex.NaN
  }

  log() {
    return Complex.NaN
  }

  factorial() {
    return Complex.NaN
  }
}