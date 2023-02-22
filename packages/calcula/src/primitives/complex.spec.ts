import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { boolean } from './boolean'
import { complex, $complex } from './complex'
import { expectToEqualWithSnapshot } from '../utility/expectations'

describe('$complex', () => {
  it('returns a Complex for a numeric pair parameter', () => {
    expect($complex([1, 2])).toEqual({
      clade: Clades.primitive, genus: undefined, species: Species.complex, 
      a: 1, b: 2      
    })
  })
})

describe('complex', () => {
  it('returns a Writer<Complex> for a number pair input', () => {
    expectToEqualWithSnapshot(
      complex([1, 2]), $complex([1, 2])
    )
  })

  it('returns a Writer<Complex> for a real input', () => {
    expectToEqualWithSnapshot(
      complex(real(5)), $complex([5, 0])
    )
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expectToEqualWithSnapshot(
      complex(complex([1, 2])), $complex([1, 2])
    )
  })

  it('returns a Writer<Complex> for a boolean input', () => {
    expectToEqualWithSnapshot(
      complex(boolean(true)), complex([1, 0])
    )
  })
})
