import { Base } from './Expression'
import { method, multi, Multi } from '@arrows/multimethod'

export class Boolean extends Base {
  readonly $kind = 'Boolean'
  constructor(readonly value: boolean) { super() }

  static readonly true = new Boolean(true);
  static readonly false = new Boolean(false);
}

export type BoolFunc = Multi & ((value: boolean) => Boolean)

export const bool: BoolFunc = multi(
  method(false, Boolean.false),
  method(true, Boolean.true)
)
