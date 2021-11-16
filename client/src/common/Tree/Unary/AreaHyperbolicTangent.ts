import { Unary, unary, Kind, Visitor  } from "./Unary";

export class AreaHyperbolicTangent extends Unary {
  static readonly function: string = 'atanh'

  readonly $kind = Kind.AreaHyperbolicTangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAreaHyperbolicTangent(this)
  }

  get function(): string { return AreaHyperbolicTangent.function }
}

export const atanh = unary(AreaHyperbolicTangent)
