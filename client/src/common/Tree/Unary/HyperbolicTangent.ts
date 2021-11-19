import { Unary, unary, Kind, Visitor  } from "./Unary";

export class HyperbolicTangent extends Unary {
  static readonly function: string = 'tanh'

  readonly $kind = Kind.HyperbolicTangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitHyperbolicTangent(this)
  }

  get function(): string { return HyperbolicTangent.function }
}

export const tanh = unary(HyperbolicTangent)
