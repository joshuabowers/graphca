import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { boolean } from './boolean'
import { complex } from './complex'

describe('real', () => {
  it('returns a Writer<Real> for a number input', () => {
    expect(real(5)).toEqual({
      value: {
        clade: Clades.primitive, genus: undefined, species: Species.real, 
        value: 5
      },
      log: []
    })
  })

  it('returns a Writer<Real> for a real input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.real, 
      value: 5
    }
    expect(real(real(5))).toEqual({
      value: output,
      log: [{inputs: [real(5).value], output, action: ''}]
    })
  })

  it('returns a Writer<Real> for a complex input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.real, 
      value: 1
    }
    expect(real(complex([1, 2]))).toEqual({
      value: output,
      log: [{inputs: [complex([1, 2]).value], output, action: 'cast to real'}]
    })
  })

  it('returns a Writer<Real> for a boolean input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.real, 
      value: 1
    }
    expect(real(boolean(true))).toEqual({
      value: output,
      log: [{inputs: [boolean(true).value], output, action: 'cast to real'}]
    })
  })
})
