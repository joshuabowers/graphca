import { Binary, binary, Kind, Visitor } from './Binary'

const operators = ['^']

export class Exponentiation extends Binary {
  readonly $kind = Kind.Exponentiation

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitExponentiation(this)
  }
}

export const raise = binary(Exponentiation)
