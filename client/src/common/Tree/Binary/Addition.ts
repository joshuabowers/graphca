import { Binary, binary, Kind, Visitor } from './Binary'

const operators = ['+']

export class Addition extends Binary {
  readonly $kind = Kind.Addition

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitAddition(this)
  }
}

export const add = binary(Addition)
