import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { complex } from './complex'
import { boolean } from './boolean'

describe('boolean', () => {
  it('returns a Writer<Boolean> for a system boolean input', () => {
    expect(boolean(true)).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.boolean, 
        value: true
      },
      log: []
    })
  })

  it('returns a Writer<Boolean> for a real input', () => {
    expect(boolean(real(5))).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.boolean, 
        value: true
      },
      log: [{input: real(5).value, action: 'cast to boolean'}]
    })
  })

  it('returns a Writer<Boolean> for a complex input', () => {
    expect(boolean(complex([1, 2]))).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.boolean, 
        value: true
      },
      log: [{input: complex([1, 2]).value, action: 'cast to boolean'}]
    })
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expect(boolean(boolean(false))).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.boolean, 
        value: false
      },
      log: [{input: boolean(false).value, action: ''}]
    })
  })
})
