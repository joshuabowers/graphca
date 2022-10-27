import { Clades, Species } from '../utility/tree'
import { real } from './real'
import { complex } from './complex'
import { boolean, $boolean } from './boolean'
import { Unicode } from '../Unicode'
import { expectWriterTreeNode } from '../utility/expectations'

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
    expectWriterTreeNode(boolean(true), $boolean(true))(
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a Writer<Boolean> for a real input', () => {
    expectWriterTreeNode(boolean(real(5)), $boolean(true))(
      ['5', '5', 'given primitive'],
      ['5', 'true', 'cast to Boolean from Real']
    )
  })

  it('returns a Writer<Boolean> for a complex input', () => {
    const s = `1+2${Unicode.i}`
    expectWriterTreeNode(boolean(complex([1, 2])), $boolean(true))(
      [s, s, 'given primitive'],
      [s, 'true', 'cast to Boolean from Complex']
    )
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expectWriterTreeNode(boolean(boolean(false)), $boolean(false))(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'copied Boolean']
    )
  })
})
