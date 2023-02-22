import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { complex } from './complex'
import { boolean, $boolean } from './boolean'
import { expectToEqualWithSnapshot } from '../utility/expectations'

describe('$boolean', () => {
  it('returns a Boolean for a system boolean parameter', () => {
    expect($boolean(true)).toEqual({
      clade: Clades.primitive, genus: undefined, species: Species.boolean, 
      value: true
    })
  })
})

describe('boolean', () => {
  it('returns a Writer<Boolean> for a system boolean input', () => {
    expectToEqualWithSnapshot(
      boolean(true), $boolean(true)
    )
  })

  it('returns a Writer<Boolean> for a real input', () => {
    expectToEqualWithSnapshot(
      boolean(real(5)), $boolean(true)
    )
  })

  it('returns a Writer<Boolean> for a complex input', () => {
    expectToEqualWithSnapshot(
      boolean(complex([1, 2])), $boolean(true)
    )
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expectToEqualWithSnapshot(
      boolean(boolean(false)), $boolean(false)
    )
  })
})
