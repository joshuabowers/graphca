import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { boolean } from './boolean'
import { complex } from './complex'

describe('complex', () => {
  it('returns a Writer<Complex> for a number pair input', () => {
    expect(complex([1, 2])).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.complex, 
        a: 1, b: 2
      },
      log: []
    })
  })

  it('returns a Writer<Complex> for a real input', () => {
    expect(complex(real(5))).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.complex, 
        a: 5, b: 0
      },
      log: [{input: real(5).value, action: 'cast to complex'}]
    })
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expect(complex(complex([1, 2]))).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.complex, 
        a: 1, b: 2
      },
      log: [{input: complex([1, 2]).value, action: ''}]
    })
  })

  it('returns a Writer<Complex> for a boolean input', () => {
    expect(complex(boolean(true))).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.complex, 
        a: 1, b: 0
      },
      log: [{input: boolean(true).value, action: 'cast to complex'}]
    })
  })
})
