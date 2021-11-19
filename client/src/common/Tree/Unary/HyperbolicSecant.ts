import { Unary, unary, Kind, Visitor  } from "./Unary";

export class HyperbolicSecant extends Unary {
  static readonly function: string = 'sech'

  readonly $kind = Kind.HyperbolicSecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitHyperbolicSecant(this)
  }

  get function(): string { return HyperbolicSecant.function }
}

export const sech = unary(HyperbolicSecant)
