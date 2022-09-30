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
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.complex, 
      a: 5, b: 0
    }
    expect(complex(real(5))).toEqual({
      value: output,
      log: [{
        inputs: [real(5).value], 
        output,
        action: 'cast to complex'
      }]
    })
  })

  it('returns a Writer<Complex> for a complex input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.complex, 
      a: 1, b: 2
    }
    expect(complex(complex([1, 2]))).toEqual({
      value: output,
      log: [{inputs: [complex([1, 2]).value], output, action: ''}]
    })
  })

  it('returns a Writer<Complex> for a boolean input', () => {
    const output = {
      clade: Clades.primitive, genus: undefined, species: Species.complex, 
      a: 1, b: 0
    }
    expect(complex(boolean(true))).toEqual({
      value: output,
      log: [{inputs: [boolean(true).value], output, action: 'cast to complex'}]
    })
  })
})
