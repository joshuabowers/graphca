import { isGenus, Genera, Species } from "../../utility/tree"
import { BinaryNode } from "../../closures/binary"

export type ConnectiveNode = BinaryNode & {
  readonly genus: Genera.connective
}

export type Connective<S extends Species> = ConnectiveNode & {
  readonly species: S
}

export const isConnective = isGenus<ConnectiveNode>(Genera.connective)
