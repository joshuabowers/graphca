import { Writer, unit } from "../monads/writer"
import { TreeNode, Genera, Species, Notation } from "../utility/tree"
import { BinaryNode, binary, binaryFnRule } from "../closures/binary"
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

export const permuteRule = binaryFnRule('P')
export const combineRule = binaryFnRule('C')

const calculatePermutation = <T extends TreeNode>(l: T, r: T): Writer<T> =>
  divide(
    factorial(unit(l)),
    factorial(subtract(unit(l), unit(r)))
  ) as unknown as Writer<T>

export const [permute, isPermutation, $permute] = binary<Permutation>(
  'P', Notation.prefix, Species.permute, Genera.combinatorics
)(
  (l, r) => calculatePermutation(l, r), 
  (l, r) => calculatePermutation(l, r), 
  (l, r) => calculatePermutation(l, r), 
)()

const calculateCombination = <T extends TreeNode>(l: T, r: T): Writer<T> =>
  divide(
    factorial(unit(l)),
    multiply(factorial(unit(r)), factorial(subtract(unit(l), unit(r))))
  ) as unknown as Writer<T>

export const [combine, isCombination, $combine] = binary<Combination>(
  'C', Notation.prefix, Species.combine, Genera.combinatorics
)(
  (l, r) => calculateCombination(l, r),
  (l, r) => calculateCombination(l, r),
  (l, r) => calculateCombination(l, r)
)()
