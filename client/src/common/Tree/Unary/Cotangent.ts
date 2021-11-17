import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Cotangent extends Unary {
  static readonly function: string = 'cot'

  readonly $kind = Kind.Cotangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitCotangent(this)
  }

  get function(): string { return Cotangent.function }
}

export const cot = unary(Cotangent)
