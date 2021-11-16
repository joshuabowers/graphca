import { Node, Kind, Visitor } from './Node'
export type { Node, Visitor }
export { Kind }

export abstract class Expression implements Node {
  abstract readonly $kind: Kind

  abstract toString(): string

  equals(that: Node): boolean {
    return this.$kind === that.$kind
  }

  abstract accept<Value>(visitor: Visitor<Value>): Value
}
