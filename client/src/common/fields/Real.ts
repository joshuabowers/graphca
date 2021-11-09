import { Unicode } from '../MathSymbols'
import { Field } from './Field'

export class Real extends Field<Real> {
  static PI = new Real(Math.PI)
  static Epsilon = new Real(Number.EPSILON)
  static Zero = new Real(0)
  static Infinity = new Real(Infinity)
  static E = new Real(Math.E)
  static NaN = new Real(NaN)

  value: number;

  constructor(value: number | string){
    super()
    this.value = Number(value)
  }

  get fieldName(): string {
    return 'REAL'
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

  cosh() {
    return new Real(Math.cosh(this.value))
  }

  sinh() {
    return new Real(Math.sinh(this.value))
  }

  tanh() {
    return new Real(Math.tanh(this.value))
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

  acosh() {
    return new Real(Math.acosh(this.value))
  }

  asinh() {
    return new Real(Math.asinh(this.value))
  }

  atanh() {
    return new Real(Math.atanh(this.value))
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

  cast(value: number) {
    return new Real(value)
  }

  lt(that: Real) {
    return this.value < that.value
  }

  isNegative() {
    return this.value < 0
  }

  isInteger() {
    return Number.isInteger(this.value)
  }

  isHalfInteger() {
    return (Math.abs(this.value) % 1) === 0.5
  }
}