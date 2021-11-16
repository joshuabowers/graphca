import { Unicode } from '../MathSymbols'
import { Expression, Kind, Visitor } from './Expression'

// Keeping this out of unary as it likely will have some
// form of limits: i.e. the variables being differentiated
// over
export class Derivative extends Expression {
  static readonly function: string = Unicode.derivative

  readonly $kind = Kind.Derivative
  readonly expression: Expression

  constructor(expression: Expression){
    super()
    this.expression = expression
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitDerivative(this)
  }

  toString(): string {
    return `${this.function}(${this.expression})`
  }

  get function(): string { return Derivative.function }
}

export function differentiate(expression: Expression) {
  return new Derivative(expression)
}
