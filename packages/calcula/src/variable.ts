import { Base } from './Expression'
import { Scope } from './scope'

export class Variable extends Base {
  readonly $kind = 'Variable'
  constructor(readonly name: string, readonly value?: Base) { super() }
}

export function variable(name: string, value?: Base) {
  return new Variable(name, value)
}

export function assign(name: string, value: Base, scope?: Scope) {
  const v = variable(name, value)
  scope?.set(name, v)
  return v
}
