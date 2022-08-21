import { Writer, unit } from '../monads/writer'
import { $kind } from '../utility/ASTNode'
import { Nil } from "../closures/primitive"
export { Nil }

// import { Base } from './Expression';

// export class Nil extends Base {
//   readonly $kind = 'Nil';
//   static readonly instance = new Nil();
//   protected constructor(){super()}
// }

// export function nil() {
//   return Nil.instance;
// }

export const nil: Writer<Nil> = unit({
  [$kind]: 'Nil',
  isUnary: false,
  isBinary: false,
  isPrimitive: true
})
