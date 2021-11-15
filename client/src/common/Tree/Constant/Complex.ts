import { Unicode } from '../../MathSymbols'
import { Field, Node, Kind, Visitor } from './Field'

export class Complex extends Field {
  readonly $kind = Kind.Complex
  readonly a: number
  readonly b: number

  constructor(a: number, b: number) {
    super()
    this.a = a
    this.b = b
  }

  toString(): string {
    return `${this.a} + ${this.b}${Unicode.i}`
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
}

export function complex(a: number, b: number = 0) {
  return new Complex(a, b)
}
