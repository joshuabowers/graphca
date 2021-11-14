import { Unicode } from '../../MathSymbols'
import { Binary, Expression, binary } from './Binary'

const operators = [Unicode.division, '/']

export class Division extends Binary {
  readonly $type = 'Division'

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const divide = binary(Division)
