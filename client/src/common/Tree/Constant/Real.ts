import { Unicode } from '../../MathSymbols'
import { Field, Node, Kind, Visitor } from './Field'

export class Real extends Field<Real> {
  static PI = new Real(Math.PI)
  static Epsilon = new Real(Number.EPSILON)
  static Zero = new Real(0)
  static Infinity = new Real(Infinity)
  static E = new Real(Math.E)
  static Euler = new Real(0.57721566490153286060)
  static NaN = new Real(NaN)

  readonly $kind = Kind.Real
  readonly value: number

  constructor(value: number | string){
    super()
    this.value = Number(value)
  }

  toString(): string {
    return this.value === Infinity ? Unicode.infinity : this.value.toString()
  }

  equals(that: Node): boolean {
    return super.equals(that) && this.value === (that as Real).value
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitReal(this)
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

  sec() {
    return new Real(1 / Math.cos(this.value))
  }

  csc() {
    return new Real(1 / Math.sin(this.value))
  }

  cot() {
    return new Real(1 / Math.tan(this.value))
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

  sech() {
    return new Real(1 / Math.cosh(this.value))
  }

  csch() {
    return new Real(1 / Math.sinh(this.value))
  }

  coth() {
    return new Real(1 / Math.tanh(this.value))
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

  asec() {
    return new Real(Math.acos(1 / this.value))
  }

  acsc() {
    return new Real(Math.asin(1 / this.value))
  }

  acot() {
    return new Real(Math.PI/2 - Math.atan(this.value))
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

  asech() {
    return new Real(Math.acosh(1 / this.value))
  }

  acsch() {
    return new Real(Math.asinh(1 / this.value))
  }

  acoth() {
    return new Real(Math.atanh(1 / this.value))
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

export function real(value: number | string) {
  return new Real(value)
}
