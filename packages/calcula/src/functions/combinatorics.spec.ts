import { expectCloseTo, expectWriter } from '../utility/expectations';
import { Clades, Genera, Species } from '../utility/tree';
import { real, complex } from '../primitives';
import { variable } from '../variable'
import { Permutation, Combination, permute, combine } from "./combinatorics";

describe('permute', () => {
  it('calculates the permutation for real inputs', () => {
    expectCloseTo(permute(real(5), real(3)), real(60), 10)
  })

  it('calculates the permutation for complex numbers', () => {
    expectCloseTo(
      permute(complex([0, 5]), complex([1, 1])), 
      complex([-0.927726831821, 0.060010755560]), 
      10
    )
  })

  it('generates a Permutation for unbound sub-expressions', () => {
    expectWriter(permute(variable('n'), variable('r')))(
      {
        clade: Clades.binary, genus: Genera.combinatorics, species: Species.permute,
        left: variable('n'), right: variable('r')
      } as Permutation,
      [[variable('n').value, variable('r').value], 'permutation']
    )
  })
})

describe('combine', () => {
  it('calculates the combination for real inputs', () => {
    expectCloseTo(combine(real(5), real(3)), real(10), 10)
  })

  it('calculates the combination for complex numbers', () => {
    expectCloseTo(
      combine(complex([0, 5]), complex([1, 1])),
      complex([-1.075594610779, 0.657018673056]),
      10
    )
  })

  it('generates a Combination for unbound sub-expressions', () => {
    expectWriter(combine(variable('n'), variable('r')))(
      {
        clade: Clades.binary, genus: Genera.combinatorics, species: Species.combine,
        left: variable('n'), right: variable('r')
      } as Combination,
      [[variable('n').value, variable('r').value], 'combination']
    )
  })
})
