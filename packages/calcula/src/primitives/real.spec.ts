import { Clades, Species } from '../utility/tree'
import { real, $real } from './real'
import { boolean } from './boolean'
import { complex } from './complex'
import { Unicode } from '../Unicode'
import { expectWriterTreeNode } from '../utility/expectations'

describe('$real', () => {
  it('returns a Real given a numeric parameter', () => {
    expect($real(5)).toEqual({
      clade: Clades.primitive, genus: undefined, species: Species.real, 
      value: 5
    })
  })
})

describe('real', () => {
  it('returns a Writer<Real> for a number input', () => {
    expectWriterTreeNode(real(5), $real(5))(
      ['5', '5', 'given primitive']
    )
  })

  it('returns a Writer<Real> for a real input', () => {
    expectWriterTreeNode(real(real(5)), $real(5))(
      ['5', '5', 'given primitive'],
      ['5', '5', 'copied Real']
    )
  })

  it('returns a Writer<Real> for a complex input', () => {
    expectWriterTreeNode(real(complex([1, 2])), $real(1))(
      [`1+2${Unicode.i}`, `1+2${Unicode.i}`, 'given primitive'],
      [`1+2${Unicode.i}`, '1', 'cast to Real from Complex']
    )
  })

  it('returns a Writer<Real> for a boolean input', () => {
    expectWriterTreeNode(real(boolean(true)), $real(1))(
      ['true', 'true', 'given primitive'],
      ['true', '1', 'cast to Real from Boolean']
    )
  })
})
