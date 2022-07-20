import { Base, Constructor } from './Expression'
import { Binary, binary } from './binary'
import { Boolean, bool } from './boolean'
import { abs } from './absolute'

export class LessThan extends Binary {
  readonly $kind = 'LessThan'
}

export class GreaterThan extends Binary {
  readonly $kind = 'GreaterThan'
}

export class LessThanEquals extends Binary {
  readonly $kind = 'LessThanEquals'
}

export class GreaterThanEquals extends Binary {
  readonly $kind = 'GreaterThanEquals'
}

export const lessThan = binary(LessThan, Boolean)(
  (l, r) => bool(l.value < r.value),
  (l, r) => bool(abs(l).a < abs(r).a)
)

export const greaterThan = binary(GreaterThan, Boolean)(
  (l, r) => bool(l.value > r.value),
  (l, r) => bool(abs(l).a > abs(r).a)
)

export const lessThanEquals = binary(LessThanEquals, Boolean)(
  (l, r) => bool(l.value <= r.value),
  (l, r) => bool(abs(l).a <= abs(r).a)
)

export const greaterThanEquals = binary(GreaterThanEquals, Boolean)(
  (l, r) => bool(l.value >= r.value),
  (l, r) => bool(abs(l).a >= abs(r).a)
)
