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
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.boolean, 
      value: true
    }
    expect(boolean(real(5))).toEqual({
      value: output,
      log: [{inputs: [real(5).value], output, action: 'cast to boolean'}]
    })
  })

  it('returns a Writer<Boolean> for a complex input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.boolean, 
      value: true
    }
    expect(boolean(complex([1, 2]))).toEqual({
      value: output,
      log: [{inputs: [complex([1, 2]).value], output, action: 'cast to boolean'}]
    })
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.boolean, 
      value: false
    }
    expect(boolean(boolean(false))).toEqual({
      value: output,
      log: [{inputs: [boolean(false).value], output, action: ''}]
    })
  })
})
