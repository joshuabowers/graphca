export interface Node {
  readonly $type: string
  toString(): string
  equals(that: Node): boolean
}