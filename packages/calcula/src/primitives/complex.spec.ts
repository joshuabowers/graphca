import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { boolean } from './boolean'
import { complex, $complex } from './complex'
import { Unicode } from '../Unicode'
import { expectWriterTreeNode } from '../utility/expectations'

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
    expectWriterTreeNode(complex([1, 2]), $complex([1, 2]))(
      [`1+2${Unicode.i}`, `1+2${Unicode.i}`, 'given primitive']
    )
  })

  it('returns a Writer<Complex> for a real input', () => {
    expectWriterTreeNode(complex(real(5)), $complex([5, 0]))(
      ['5', '5', 'given primitive'],
      ['5', `5+0${Unicode.i}`, 'cast to Complex from Real']
    )
  })

  it('returns a Writer<Complex> for a complex input', () => {
    const s = `1+2${Unicode.i}`
    expectWriterTreeNode(complex(complex([1, 2])), $complex([1, 2]))(
      [s, s, 'given primitive'],
      [s, s, 'copied Complex']
    )
  })

  it('returns a Writer<Complex> for a boolean input', () => {
    expectWriterTreeNode(complex(boolean(true)), complex([1, 0]))(
      ['true', 'true', 'given primitive'],
      ['true', `1+0${Unicode.i}`, 'cast to Complex from Boolean']
    )
  })
})
