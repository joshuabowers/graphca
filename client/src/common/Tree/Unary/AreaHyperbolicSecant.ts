import { Unary, unary, Kind, Visitor  } from "./Unary";

export class AreaHyperbolicSecant extends Unary {
  static readonly function: string = 'asech'

  readonly $kind = Kind.AreaHyperbolicSecant

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAreaHyperbolicSecant(this)
  }

  get function(): string { return AreaHyperbolicSecant.function }
}

export const asech = unary(AreaHyperbolicSecant)
