import { Writer } from '../monads/writer'
import { $kind } from './ASTNode'
import { Primitive } from '../primitives'

export type Node = Primitive
export type Kinds = Node[typeof $kind]

export const is = (kind: Kinds) => 
  <T extends Node>(t: Writer<T>) => t?.value?.[$kind] === kind
