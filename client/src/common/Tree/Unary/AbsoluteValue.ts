import { Unary, unary, Kind, Visitor } from "./Unary";

export class AbsoluteValue extends Unary {
  static function: string = 'abs'

  readonly $kind = Kind.AbsoluteValue

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAbsoluteValue(this)
  }

  get function(): string { return AbsoluteValue.function }
}

export const abs = unary(AbsoluteValue)
