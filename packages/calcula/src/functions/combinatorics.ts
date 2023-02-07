import { Writer } from "../monads/writer"
import { Operation } from "../utility/operation"
import { TreeNode, Genera, Species, Notation } from "../utility/tree"
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

const calculatePermutation = <T extends TreeNode>(
  l: Writer<T, Operation>, r: Writer<T, Operation>
): Writer<T, Operation> =>
  divide(
    factorial(l),
    factorial(subtract(l, r))
  ) as unknown as Writer<T, Operation>

export const [permute, isPermutation, $permute] = binary<Permutation>(
  'P', Notation.prefix, Species.permute, Genera.combinatorics
)(
  (l, r) => calculatePermutation(l, r), 
  (l, r) => calculatePermutation(l, r), 
  (l, r) => calculatePermutation(l, r), 
)()

const calculateCombination = <T extends TreeNode>(
  l: Writer<T, Operation>, r: Writer<T, Operation>
): Writer<T, Operation> =>
  divide(
    factorial(l),
    multiply(factorial(r), factorial(subtract(l, r)))
  ) as unknown as Writer<T, Operation>

export const [combine, isCombination, $combine] = binary<Combination>(
  'C', Notation.prefix, Species.combine, Genera.combinatorics
)(
  (l, r) => calculateCombination(l, r),
  (l, r) => calculateCombination(l, r),
  (l, r) => calculateCombination(l, r)
)()
