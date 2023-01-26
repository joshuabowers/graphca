import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { nor, $nor } from './jointDenial'
import { Unicode } from '../../Unicode'

describe('$nor', () => {
  it('generates a Joint Denial for a pair of TreeNode inputs', () => {
    expect(
      $nor(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.nor,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('nor', () => {
  it('returns false when given two true things', () => {
    expectWriterTreeNode(
      nor(boolean(true), boolean(true)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.nor} true`,
        `false`,
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      nor(boolean(false), boolean(true)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.nor} true`,
        'false',
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      nor(boolean(true), boolean(false)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.nor} false`,
        'false',
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      nor(boolean(false), boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.nor} false`,
        `${Unicode.not}(false)`,
        'joint denial complementation'
      ],
      [
        `${Unicode.not}(false)`,
        'true',
        'boolean complement'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the complement of the left operand if the right is false', () => {
    expectWriterTreeNode(
      nor(variable('x'), boolean(false)),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.nor} false`,
        `${Unicode.not}(x)`,
        'joint denial complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns the complement of the right operand if the left is false', () => {
    expectWriterTreeNode(
      nor(boolean(false), variable('x')),
      not(variable('x'))
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.nor} x`,
        `${Unicode.not}(x)`,
        'joint denial complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns false if the right operand is true', () => {
    expectWriterTreeNode(
      nor(variable('x'), boolean(true)),
      boolean(false)
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.nor} true`,
        'false',
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false if the left operand is true', () => {
    expectWriterTreeNode(
      nor(boolean(true), variable('x')),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.nor} x`,
        'false',
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns the complement of the left operand if left is equivalent to right', () => {
    expectWriterTreeNode(
      nor(variable('x'), variable('x')),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `x ${Unicode.nor} x`,
        `${Unicode.not}(x)`,
        'joint denial complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns a conjunction of mutually complemented operands', () => {
    expectWriterTreeNode(
      nor(not(variable('x')), not(variable('y'))),
      and(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      ['y', 'y', 'given variable'],
      [
        `${Unicode.not}(y)`,
        `${Unicode.not}(y)`,
        'complement'
      ],
      [
        `${Unicode.not}(x) ${Unicode.nor} ${Unicode.not}(y)`,
        `x ${Unicode.and} y`,
        'De Morgan'
      ],
      [
        `x ${Unicode.and} y`,
        `(x${Unicode.and}y)`,
        'conjunction'
      ]
    )
  })

  it('returns false if the right operand is the complement of the left', () => {
    expectWriterTreeNode(
      nor(variable('x'), not(variable('x'))),
      boolean(false)
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      [
        `x ${Unicode.nor} ${Unicode.not}(x)`,
        'false',
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false if the left operand is the complement of the right', () => {
    expectWriterTreeNode(
      nor(not(variable('x')), variable('x')),
      boolean(false)
    )(
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x) ${Unicode.nor} x`,
        'false',
        'joint denial annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns a JointDenial on variable input', () => {
    expectWriterTreeNode(
      nor(variable('x'), variable('y')),
      $nor(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.nor} y`,
        `(x${Unicode.nor}y)`,
        'joint denial'
      ]
    )
  })
})
