import { Expression, Node, Kind } from '../Expression'
export type { Expression, Node }
export { Kind }

export abstract class Field extends Expression {

}

export function field<T extends Field, Args>(type: (new(args: Args) => T)) {
  return function(args: Args): T {
    return new type(args)
  }
}
