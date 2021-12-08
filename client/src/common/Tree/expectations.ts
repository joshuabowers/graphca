import { method, multi, Multi, _ } from '@arrows/multimethod'
import { is } from './is'
import { Real } from './real'
import { Complex } from './complex'

export type ExpectCloseTo = Multi 
  & ((actual: Real, expected: Real, precision: number) => void)
  & ((actual: Complex, expected: Complex, precision: number) => void)

export const expectCloseTo: ExpectCloseTo = multi(
  method(
    [is(Real), is(Real), _], 
    (actual: Real, expected: Real, precision: number) => 
      expect(actual.value).toBeCloseTo(expected.value, precision)
  ),
  method(
    [is(Complex), is(Complex), _],
    (actual: Complex, expected: Complex, precision: number) => {
      expect(actual.a).toBeCloseTo(expected.a, precision)
      expect(actual.b).toBeCloseTo(expected.b, precision)
    }
  )
)
