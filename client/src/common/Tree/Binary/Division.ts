import { Unicode } from '../../MathSymbols'
import { Binary, binary, Kind, Visitor } from './Binary'

const operators = [Unicode.division, '/']

export class Division extends Binary {
  readonly $kind = Kind.Division

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }

  accept<Value>(visitor: Visitor<Value>): Value {
    return visitor.visitDivision(this)
  }
}

export const divide = binary(Division)
