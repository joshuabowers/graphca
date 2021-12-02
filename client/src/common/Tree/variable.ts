import { Base } from './Expression'

export class Variable extends Base {
  readonly $kind = 'Variable'
  constructor(readonly name: string, readonly value?: Base) { super() }
}

export function variable(name: string, value?: Base) {
  return new Variable(name, value)
}
