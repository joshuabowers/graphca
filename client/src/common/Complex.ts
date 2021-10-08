import { Unicode } from "./MathSymbols";

export class Complex {
  a: number;
  b: number;

  constructor(a: number, b: number = 0) {
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
}