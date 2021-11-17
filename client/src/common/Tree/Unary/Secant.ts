import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Secant extends Unary {
  static readonly function: string = 'sec'

  readonly $kind = Kind.Secant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitSecant(this)
  }

  get function(): string { return Secant.function }
}

export const sec = unary(Secant)
