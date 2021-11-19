import { Unary, unary, Kind, Visitor  } from "./Unary";

export class AreaHyperbolicCosine extends Unary {
  static readonly function: string = 'acosh'

  readonly $kind = Kind.AreaHyperbolicCosine

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAreaHyperbolicCosine(this)
  }

  get function(): string { return AreaHyperbolicCosine.function }
}

export const acosh = unary(AreaHyperbolicCosine)
