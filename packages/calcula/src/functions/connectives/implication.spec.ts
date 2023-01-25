import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { implies, $implies } from './implication'
import { Unicode } from '../../Unicode'

describe('$implies', () => {
  it('generates a Implication for a pair of TreeNode inputs', () => {
    expect(
      $implies(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.implies,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('implies', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      implies(boolean(true), boolean(true)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.implies} true`,
        'true',
        'implicative identity'
      ]
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriterTreeNode(
      implies(boolean(false), boolean(true)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.implies} true`,
        'true',
        'implicative annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      implies(boolean(true), boolean(false)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.implies} false`,
        'false',
        'implicative identity'
      ]
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      implies(boolean(false), boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.implies} false`,
        'true',
        'implicative annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      implies(boolean(true), variable('x')),
      variable('x')
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.implies} x`,
        'x',
        'implicative identity'
      ]
    )
  })

  it('returns true if the right operand is true', () => {
    expectWriterTreeNode(
      implies(variable('x'), boolean(true)),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.implies} true`,
        'true',
        'implicative annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left operand is false', () => {
    expectWriterTreeNode(
      implies(boolean(false), variable('x')),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.implies} x`,
        'true',
        'implicative annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectWriterTreeNode(
      implies(variable('x'), boolean(false)),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.implies} false`,
        `${Unicode.not}(x)`,
        'implicative complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })
  
  it('returns an Implication on variable input', () => {
    expectWriterTreeNode(
      implies(variable('x'), variable('y')),
      $implies(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.implies} y`,
        `(x${Unicode.implies}y)`,
        'implication'
      ]
    )
  })
})
