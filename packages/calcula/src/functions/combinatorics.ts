import { Base } from './Expression'
import { Binary, binary } from './binary'
import { subtract } from './addition'
import { multiply, divide } from './multiplication'
import { factorial } from './factorial'

export class Permutation extends Binary {
  readonly $kind = 'Permutation'
}

export class Combination extends Binary {
  readonly $kind = 'Combination'
}

const calculatePermutation = <T extends Base>(l: T, r: T): T =>
  divide(
    factorial(l),
    factorial(subtract(l, r))
  ) as unknown as T

export const permute = binary(Permutation)(
  (l, r) => calculatePermutation(l, r),
  (l, r) => calculatePermutation(l, r)
)()

const calculateCombination = <T extends Base>(l: T, r: T): T =>
  divide(
    factorial(l),
    multiply(factorial(r), factorial(subtract(l, r)))
  ) as unknown as T

export const combine = binary(Combination)(
  (l, r) => calculateCombination(l, r),
  (l, r) => calculateCombination(l, r)
)()
