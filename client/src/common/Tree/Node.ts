import { Kind } from "./Kind";
import { Visitor } from "../visitors/Visitor";
export { Kind }
export type { Visitor }

export interface Node {
  readonly $kind: Kind
  toString(): string
  equals(that: Node): boolean
  accept<Value>(visitor: Visitor<Value>): Value
}
