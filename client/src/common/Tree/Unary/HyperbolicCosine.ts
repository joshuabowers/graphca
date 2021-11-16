import { Unary, unary, Kind, Visitor  } from "./Unary";

export class HyperbolicCosine extends Unary {
  static readonly function: string = 'cosh'

  readonly $kind = Kind.HyperbolicCosine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitHyperbolicCosine(this)
  }

  get function(): string { return HyperbolicCosine.function }
}

export const cosh = unary(HyperbolicCosine)
