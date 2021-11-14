import { Binary, binary, Kind } from './Binary'

const operators = ['^']

export class Exponential extends Binary {
  readonly $kind = Kind.Exponential

  static get operators(): string[] {
    return operators
  }

  get operators(): string[] {
    return operators
  }
}

export const raise = binary(Exponential)
