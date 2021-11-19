import { Unary, unary, Kind, Visitor  } from "./Unary";

export class HyperbolicCotangent extends Unary {
  static readonly function: string = 'coth'

  readonly $kind = Kind.HyperbolicCotangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitHyperbolicCotangent(this)
  }

  get function(): string { return HyperbolicCotangent.function }
}

export const coth = unary(HyperbolicCotangent)
