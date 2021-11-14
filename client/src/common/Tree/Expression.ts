import { Node } from './Node'
export type { Node }

export abstract class Expression implements Node {
  abstract readonly $type: string

  abstract toString(): string

  equals(that: Node): boolean {
    return this.$type === that.$type
  }
}