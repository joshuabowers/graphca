import { expectCloseTo } from './expectations';
import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { Permutation, Combination, permute, combine } from "./combinatorics";

describe('permute', () => {
  it('calculates the permutation for real inputs', () => {
    expect(permute(real(5), real(3))).toEqual(real(60))
  })

  it('calculates the permutation for complex numbers', () => {
    expectCloseTo(
      permute(complex(0, 5), complex(1, 1)), 
      complex(-0.927726831821, 0.060010755560), 
      10
    )
  })

  it('generates a Permutation for unbound sub-expressions', () => {
    expect(permute(variable('n'), variable('r'))).toEqual(
      new Permutation(variable('n'), variable('r'))
    )
  })
})

describe('combine', () => {
  it('calculates the combination for real inputs', () => {
    expect(combine(real(5), real(3))).toEqual(real(10))
  })

  it('calculates the combination for complex numbers', () => {
    expectCloseTo(
      combine(complex(0, 5), complex(1, 1)),
      complex(-1.075594610779, 0.657018673056),
      10
    )
  })

  it('generates a Combination for unbound sub-expressions', () => {
    expect(combine(variable('n'), variable('r'))).toEqual(
      new Combination(variable('n'), variable('r'))
    )
  })
})
