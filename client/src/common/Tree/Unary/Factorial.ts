import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Factorial extends Unary {
  static readonly function: string = '!'

  readonly $kind = Kind.Factorial

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitFactorial(this)
  }

  toString(): string {
    return `${this.expression}${this.function}`
  }

  get function(): string { return Factorial.function }
}

export const factorial = unary(Factorial)
