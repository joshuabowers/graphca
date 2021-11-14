import { Kind } from "./Kind";
export { Kind }

export interface Node {
  readonly $kind: Kind
  toString(): string
  equals(that: Node): boolean
}