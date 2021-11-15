import { Kind } from "./Kind";
export { Kind }
import { Visitor } from "../visitors/Visitor";
export { Visitor }

export interface Node {
  readonly $kind: Kind
  toString(): string
  equals(that: Node): boolean
  accept<Value>(visitor: Visitor<Value>): Value
}
