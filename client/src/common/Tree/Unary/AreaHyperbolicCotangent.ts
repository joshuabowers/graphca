import { Unary, unary, Kind, Visitor  } from "./Unary";

export class AreaHyperbolicCotangent extends Unary {
  static readonly function: string = 'acoth'

  readonly $kind = Kind.AreaHyperbolicCotangent

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAreaHyperbolicCotangent(this)
  }

  get function(): string { return AreaHyperbolicCotangent.function }
}

export const acoth = unary(AreaHyperbolicCotangent)
