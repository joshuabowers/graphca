import { Unicode } from '../../MathSymbols'
import { Field, Node } from './Field'

export class Complex extends Field {
  readonly $type = 'Complex'
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
}

export function complex(a: number, b: number) {
  return new Complex(a, b)
}
