import { Clades, Species } from '../utility/tree'
import { real, $real } from './real'
import { boolean } from './boolean'
import { complex } from './complex'
import { nan } from './nan'
import { expectToEqualWithSnapshot } from '../utility/expectations'

describe('$real', () => {
  it('returns a Real given a numeric parameter', () => {
    expect($real(5)).toEqual({
      clade: Clades.primitive, genus: undefined, species: Species.real, 
      raw: 5
    })
  })
})

describe('real', () => {
  it('returns a Writer<Real> for a number input', () => {
    expectToEqualWithSnapshot(
      real(5), $real(5)
    )
  })

  it('returns a Writer<Real> for a real input', () => {
    expectToEqualWithSnapshot(
      real(real(5)), $real(5)
    )
  })

  it('returns a Writer<Real> for a complex input', () => {
    expectToEqualWithSnapshot(
      real(complex(1, 2)), $real(1)
    )
  })

  it('returns a Writer<Real> for a boolean input', () => {
    expectToEqualWithSnapshot(
      real(boolean(true)), $real(1)
    )
  })

  describe('of special values', () => {
    it('correctly logs e', () => {
      expectToEqualWithSnapshot(
        real(Math.E), $real(Math.E)
      )
    })

    it('correctly logs pi', () => {
      expectToEqualWithSnapshot(
        real(Math.PI), $real(Math.PI)
      )
    })

    it('correctly logs positive infinity', () => {
      expectToEqualWithSnapshot(
        real(Infinity), $real(Infinity)
      )
    })

    it('correctly logs negative infinity', () => {
      expectToEqualWithSnapshot(
        real(-Infinity), $real(-Infinity)
      )
    })

    it('rewrites numeric NaN with Writer<NaN>', () => {
      expectToEqualWithSnapshot(
        real(NaN), nan
      )
    })
  })
})
