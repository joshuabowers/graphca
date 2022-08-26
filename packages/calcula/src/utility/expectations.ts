import { method, multi, Multi, _ } from '@arrows/multimethod'
import { isWriter, Writer } from '../monads/writer'
import { TreeNode } from './tree'
import { Real, Complex, isReal, isComplex } from '../primitives'

export type ExpectCloseTo = Multi 
  & ((actual: Writer<Real>, expected: Writer<Real>, precision: number) => void)
  & ((actual: Writer<Complex>, expected: Writer<Complex>, precision: number) => void)

export const expectCloseTo: ExpectCloseTo = multi(
  method(
    [isReal, isReal, _], 
    (actual: Writer<Real>, expected: Writer<Real>, precision: number) => 
      expect(actual.value.value).toBeCloseTo(expected.value.value, precision)
  ),
  method(
    [isComplex, isComplex, _],
    (actual: Writer<Complex>, expected: Writer<Complex>, precision: number) => {
      expect(actual.value.a).toBeCloseTo(expected.value.a, precision)
      expect(actual.value.b).toBeCloseTo(expected.value.b, precision)
    }
  )
)

type Input = TreeNode|Writer<TreeNode>|[Input, Input]
export type Operation = [Input, string]

export const expectWriter = <
  Actual extends TreeNode, 
  Expected extends TreeNode|Writer<TreeNode>
>(
  actual: Writer<Actual>
) => (expected: Expected, ...operations: Operation[]) => {
  expect(actual).toEqual({
    value: isWriter(expected) ? expected.value : expected,
    log: operations.map(([input, action]) => ({
      input: isWriter(input) 
        ? input.value 
        : (Array.isArray(input) 
          ? input.map(i => isWriter(i) ? i.value : i)
          : input), 
      action
    }))
  })
}
