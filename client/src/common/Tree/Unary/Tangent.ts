import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Tangent extends Unary {
  static readonly function: string = 'tan'

  readonly $kind = Kind.Tangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitTangent(this)
  }

  get function(): string { return Tangent.function }
}

export const tan = unary(Tangent)
