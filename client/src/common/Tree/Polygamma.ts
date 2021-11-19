import { Unicode } from "../MathSymbols";
import { Expression, Kind, Visitor } from "./Expression";
import { Real } from './Constant/Real'
import { fixLeft } from "./partial";

export class Polygamma extends Expression {
  static readonly function: string = Unicode.digamma

  readonly $kind = Kind.Polygamma

  constructor(readonly order: Expression, readonly expression: Expression) {
    super()
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitPolygamma(this)
  }

  toString(): string {
    return `${this.function}(${this.order}, ${this.expression})`
  }

  get function(): string { return Polygamma.function }
}

export function polygamma(order: Expression, expression: Expression) {
  return new Polygamma(order, expression)
}

export const digamma = fixLeft(polygamma, Real.Zero)
