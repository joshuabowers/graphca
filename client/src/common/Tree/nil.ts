import { Base } from './Expression';

export class Nil extends Base {
  readonly $kind = 'Nil';
  static readonly instance = new Nil();
  protected constructor(){super()}
}

export function nil() {
  return Nil.instance;
}
