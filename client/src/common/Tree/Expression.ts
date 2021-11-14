import { Node, Kind } from './Node'
export type { Node }
export { Kind }

export abstract class Expression implements Node {
  abstract readonly $kind: Kind

  abstract toString(): string

  equals(that: Node): boolean {
    return this.$kind === that.$kind
  }
}