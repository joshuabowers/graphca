import { Field } from "./Field";

const isBigInt = (x: number | string | bigint): x is bigint => {
  return typeof x === "bigint"
}

export class Decimal extends Field<Decimal> {
  static precision = 20

  static Infinity = new Decimal(1, false)
  static NegativeInfinity = new Decimal(-1, false)

  private static toSignificand(n: number | string) {
    const parts = n.toString().split('.')
    const w = parts[0], f = parts[1] ?? '', sign = w === '-0' ? -1: 1
    let scale = Decimal.exponent()
    let s = BigInt(w) * scale
    f.split('').forEach(d => {
      scale /= BigInt(10)
      s += BigInt(d) * scale
    });
    return BigInt(sign) * s
  }

  private static exponent() { 
    return BigInt(10**Decimal.precision) 
  }

  readonly significand: bigint
  readonly isFinite: boolean
  readonly sign: number

  /**
   * Creates a new decimal to represent a fixed-point number
   * @param value either a string or number representation of a decimal;
   * should value be bigint, it is interpreted as the significand.
   */
  constructor(value: number | string | bigint, isFinite: boolean = true) {
    super()
    this.significand = isBigInt(value) ? value : Decimal.toSignificand(value)
    this.isFinite = isFinite
    this.sign = this.significand < 0 ? -1 : 1
  }

  get fieldName(): string {
    return 'DECIMAL'
  }

  toString() {
    const zeroPoint = Decimal.exponent()
    const whole = this.significand / zeroPoint
    const fractional = this.significand - (whole * zeroPoint)
    if(fractional === BigInt(0)) {
      return whole.toString()
    } else {
      return `${whole}.${fractional}`.replace(/(?<=\.\d*)(0+)$/, '')
    }
  }

  add(that: Decimal) {
    return new Decimal(this.significand + that.significand)
  }

  subtract(that: Decimal) {
    return new Decimal(this.significand - that.significand)
  }

  multiply(that: Decimal) {
    return new Decimal(
      (this.significand * that.significand) / Decimal.exponent()
    )
  }

  divide(that: Decimal) {
    if(that.significand === BigInt(0)) {
      return this.sign < 0 ? Decimal.NegativeInfinity : Decimal.Infinity
    } else if(that === Decimal.Infinity || that === Decimal.NegativeInfinity) {
      return new Decimal(0)
    }
    return new Decimal(
      (this.significand * Decimal.exponent()) / that.significand
    )
  }

  raise(that: Decimal) {
    return new Decimal(this.significand ** that.significand)
  }

  negate() {
    return new Decimal(this.significand * BigInt(-1), this.isFinite)    
  }

  cos() {
    return Decimal.Infinity
  }

  sin() {
    return Decimal.Infinity
  }

  tan() {
    return Decimal.Infinity
  }

  cosh() {
    return Decimal.Infinity
  }

  sinh() {
    return Decimal.Infinity
  }

  tanh() {
    return Decimal.Infinity
  }

  acos() {
    return Decimal.Infinity
  }

  asin() {
    return Decimal.Infinity
  }

  atan() {
    return Decimal.Infinity
  }

  acosh() {
    return Decimal.Infinity
  }

  asinh() {
    return Decimal.Infinity
  }

  atanh() {
    return Decimal.Infinity
  }

  lb() {
    return Decimal.Infinity
  }

  ln() {
    return Decimal.Infinity
  }

  lg() {
    return Decimal.Infinity
  }

  factorial() {
    return Decimal.Infinity
  }

  abs() {
    return new Decimal(
      this.sign < 0 ? this.significand * BigInt(-1) : this.significand,
      this.isFinite
    )
  }

  cast(value: number) {
    return Decimal.Infinity
  }

  lt(that: Decimal) {
    return false
  }

  isNegative(){
    return false
  }
}