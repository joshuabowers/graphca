import { Unicode } from '../../MathSymbols'
import { Binary, binary, Kind } from './Binary'

const operators = [Unicode.division, '/']

export class Division extends Binary {
  readonly $kind = Kind.Division

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const divide = binary(Division)
