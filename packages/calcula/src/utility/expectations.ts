import { method, multi, Multi, _ } from '@arrows/multimethod'
import { isWriter, Writer } from '../monads/writer'
import { Operation } from './operation'
import { TreeNode } from './tree'
import { Real, Complex, isReal, isComplex } from '../primitives'

export type ExpectCloseTo = Multi 
  & ((actual: Writer<Real, Operation>, expected: Writer<Real, Operation>, precision: number) => void)
  & ((actual: Writer<Complex, Operation>, expected: Writer<Complex, Operation>, precision: number) => void)

export const expectCloseTo: ExpectCloseTo = multi(
  method(
    [isReal, isReal, _], 
    (actual: Writer<Real, Operation>, expected: Writer<Real, Operation>, precision: number) => 
      expect(actual.value.raw).toBeCloseTo(expected.value.raw, precision)
  ),
  method(
    [isComplex, isComplex, _],
    (actual: Writer<Complex, Operation>, expected: Writer<Complex, Operation>, precision: number) => {
      expect(actual.value.raw.a).toBeCloseTo(expected.value.raw.a, precision)
      expect(actual.value.raw.b).toBeCloseTo(expected.value.raw.b, precision)
    }
  )
)

/**
 * Performs two assertions:
 * 1) Tests that actual's value is equal to expected's value
 * 2) Verifies that actual's log matches a snapshot
 * @param actual the value yielded by a process
 * @param expected the value actual is meant to evaluate to
 */
export const expectToEqualWithSnapshot = <
  Actual extends Writer<TreeNode, Operation>,
  Expected extends TreeNode|Writer<TreeNode, Operation>
>(
  actual: Actual, expected: Expected
) => {
  expect(actual.value).toEqual(isWriter(expected) ? expected.value : expected)
  expect(actual.log).toMatchSnapshot()
}
