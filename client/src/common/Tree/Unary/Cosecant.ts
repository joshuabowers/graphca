import { Unary, unary, Kind, Visitor  } from "./Unary";

export class Cosecant extends Unary {
  static readonly function: string = 'csc'

  readonly $kind = Kind.Cosecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitCosecant(this)
  }

  get function(): string { return Cosecant.function }
}

export const csc = unary(Cosecant)
