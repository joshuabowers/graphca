import { Writer, unit } from "../monads/writer"
import { TreeNode, Genera, Species } from "../utility/tree"
import { BinaryNode, binary } from "../closures/binary"
import { subtract, multiply, divide } from "../arithmetic"
import { factorial } from "./factorial"

export type CombinatoricsNode = BinaryNode & {
  readonly genus: Genera.combinatorics
}

type Combinatorics<S extends Species> = CombinatoricsNode & {
  readonly species: S
}

export type Permutation = Combinatorics<Species.permute>
export type Combination = Combinatorics<Species.combine>

const calculatePermutation = <T extends TreeNode>(l: T, r: T): Writer<T> =>
  divide(
    factorial(unit(l)),
    factorial(subtract(unit(l), unit(r)))
  ) as unknown as Writer<T>

export const [permute, isPermutation] = binary<Permutation>(
  Species.permute, Genera.combinatorics
)(
  (l, r) => [calculatePermutation(l, r), 'computed real permutation'],
  (l, r) => [calculatePermutation(l, r), 'computed complex permutation'],
  (l, r) => [calculatePermutation(l, r), 'computed boolean permutation']
)()

const calculateCombination = <T extends TreeNode>(l: T, r: T): Writer<T> =>
  divide(
    factorial(unit(l)),
    multiply(factorial(unit(r)), factorial(subtract(unit(l), unit(r))))
  ) as unknown as Writer<T>

export const [combine, isCombination] = binary<Combination>(
  Species.combine, Genera.combinatorics
)(
  (l, r) => [calculateCombination(l, r), 'computed real combination'],
  (l, r) => [calculateCombination(l, r), 'computed complex combination'],
  (l, r) => [calculateCombination(l, r), 'computed boolean combination']
)()
