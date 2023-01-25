import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { converse, $converse } from './converseImplication'
import { Unicode } from '../../Unicode'

describe('$converse', () => {
  it('generates a ConverseImplication for a pair of TreeNode inputs', () => {
    expect(
      $converse(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.converse,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('converse', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      converse(boolean(true), boolean(true)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.converse} true`, 
        'true', 
        'converse implication annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      converse(boolean(false), boolean(true)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.converse} true`,
        'false',
        'converse implication identity'
      ]
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriterTreeNode(
      converse(boolean(true), boolean(false)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.converse} false`,
        'true',
        'converse implication annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      converse(boolean(false), boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.converse} false`,
        `${Unicode.not}(false)`,
        'converse implication complementation'
      ],
      [
        `${Unicode.not}(false)`,
        'true',
        'boolean complement'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left operand is true', () => {
    expectWriterTreeNode(
      converse(boolean(true), variable('x')),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.converse} x`,
        'true',
        'converse implication annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriterTreeNode(
      converse(variable('x'), boolean(true)),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.converse} true`,
        'x',
        'converse implication identity'
      ]
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectWriterTreeNode(
      converse(boolean(false), variable('x')),
      not(variable('x'))
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.converse} x`,
        `${Unicode.not}(x)`,
        'converse implication complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns true if the right operand is false', () => {
    expectWriterTreeNode(
      converse(variable('x'), boolean(false)),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.converse} false`,
        'true',
        'converse implication annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a ConverseImplication on variable input', () => {
    expectWriterTreeNode(
      converse(variable('x'), variable('y')),
      $converse(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.converse} y`,
        `(x${Unicode.converse}y)`,
        'converse implication'
      ]
    )
  })
})
