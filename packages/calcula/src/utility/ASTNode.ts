import { Writer } from '../monads/writer'

export const $kind = Symbol('$kind')

export interface ASTNode {
  readonly [$kind]: string,
  readonly isPrimitive: boolean,
  readonly isUnary: boolean,
  readonly isBinary: boolean,
}

export type Kind<T extends string> = {readonly [$kind]: T}
export type Form<K extends string, R extends {}> = Kind<K> & R

export const areKindEqual = <T extends ASTNode, U extends ASTNode>(
  t: Writer<T>, u: Writer<U>
) => t.value[$kind] === u.value[$kind]
