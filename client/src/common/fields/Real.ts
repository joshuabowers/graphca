import { Unicode } from '../MathSymbols'
import { Field } from './Field'

export class Real extends Field<Real> {
  static PI = new Real(Math.PI)
  static Zero = new Real(0)
  static Infinity = new Real(Infinity)
  static E = new Real(Math.E)
  static NaN = new Real(NaN)

  value: number;

  constructor(value: number){
    super()
    this.value = value
  }

  toString() {
    return this.value === Infinity ? Unicode.infinity : this.value.toString()
  }

  add(that: Real) {
    return new Real(this.value + that.value);
  }

  subtract(that: Real) {
    return new Real(this.value - that.value);
  }

  multiply(that: Real) {
    return new Real(this.value * that.value);
  }

  divide(that: Real) {
    return new Real(this.value / that.value);
  }

  raise(that: Real) {
    return new Real(this.value ** that.value);
  }

  negate() {
    return new Real(-this.value)
  }

  cos() {
    return new Real(Math.cos(this.value))
  }

  sin() {
    return new Real(Math.sin(this.value))
  }

  tan() {
    return new Real(Math.tan(this.value))
  }

  acos() {
    return new Real(Math.acos(this.value))
  }

  asin() {
    return new Real(Math.asin(this.value))
  }

  atan() {
    return new Real(Math.atan(this.value))
  }

  lb() {
    return new Real(Math.log2(this.value))
  }

  ln() {
    return new Real(Math.log(this.value))
  }

  lg() {
    return new Real(Math.log10(this.value))
  }

  factorial(): Real {
    if(this.value < 0){ return Real.NaN }
    else if(this.value === 0){ return new Real(1) }
    return this.multiply(new Real(this.value - 1).factorial())
  }

  abs() {
    return new Real(Math.abs(this.value))
  }
}