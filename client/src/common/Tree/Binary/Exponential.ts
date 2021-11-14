import { Binary, Expression, binary } from './Binary'

const operators = ['^']

export class Exponential extends Binary {
  readonly $type = 'Exponential'

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const raise = binary(Exponential)
