import { Boolean, bool } from './boolean'
import { Binary, binary } from './binary'

export abstract class Connective extends Binary {}

export class Conjunction extends Connective {
  readonly $kind = 'Conjunction'
}

export class Disjunction extends Connective {
  readonly $kind = 'Disjunction'
}

export const and = binary(Conjunction, Boolean)(
  (l, r) => bool(l.value !== 0 && r.value !== 0),
  (l, r) => bool((l.a !== 0 || l.b !== 0) && (r.a !== 0 || r.b !== 0)),
  (l, r) => bool(l.value && r.value)
)

export const or = binary(Disjunction, Boolean)(
  (l, r) => bool(l.value !== 0 || r.value !== 0),
  (l, r) => bool(l.a !== 0 || l.b !== 0 || r.a !== 0 || r.b !== 0),
  (l, r) => bool(l.value || r.value)
)
