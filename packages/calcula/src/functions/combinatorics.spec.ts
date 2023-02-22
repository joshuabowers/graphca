import { unit } from '../monads/writer';
import { 
  expectToEqualWithSnapshot, expectCloseTo
} from '../utility/expectations';
import { Clades, Genera, Species } from '../utility/tree';
import { real, complex } from '../primitives';
import { variable } from '../variable'
import { permute, combine, $permute, $combine } from "./combinatorics";

describe('$permute', () => {
  it('generates a Permutation for two TreeNode inputs', () => {
    expect(
      $permute(unit(variable('n').value), unit(variable('r').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.combinatorics, species: Species.permute,
      left: unit(variable('n').value), right: unit(variable('r').value)
    })
  })
})

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
    expectToEqualWithSnapshot(
      permute(variable('n'), variable('r')),
      $permute(variable('n'), variable('r'))[0]
    )
  })
})

describe('$combine', () => {
  it('generates a Combination for two TreeNode inputs', () => {
    expect(
      $combine(unit(variable('n').value), unit(variable('r').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.combinatorics, species: Species.combine,
      left: unit(variable('n').value), right: unit(variable('r').value)
    })
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
    expectToEqualWithSnapshot(
      combine(variable('n'), variable('r')),
      $combine(variable('n'), variable('r'))[0]
    )
  })
})
