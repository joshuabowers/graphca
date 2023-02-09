import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  booleanOps, variableOps, norOps, notOps, andOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { nor, $nor } from './jointDenial'

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
      ...norOps(
        'joint deniable annihilator',
        booleanOps('true'),
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      nor(boolean(false), boolean(true)),
      boolean(false)
    )(
      ...norOps(
        'joint deniable annihilator',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      nor(boolean(true), boolean(false)),
      boolean(false)
    )(
      ...norOps(
        'joint deniable annihilator',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      nor(boolean(false), boolean(false)),
      boolean(true)
    )(
      ...norOps(
        'joint deniable complementation',
        booleanOps('false'),
        booleanOps('false'),
        notOps(
          'boolean complement',
          booleanOps('false'),
          booleanOps('true')
        )
      )
    )
  })

  it('returns the complement of the left operand if the right is false', () => {
    expectWriterTreeNode(
      nor(variable('x'), boolean(false)),
      not(variable('x'))
    )(
      ...norOps(
        'joint deniable complementation',
        variableOps('x'),
        booleanOps('false'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns the complement of the right operand if the left is false', () => {
    expectWriterTreeNode(
      nor(boolean(false), variable('x')),
      not(variable('x'))
    )(
      ...norOps(
        'joint deniable complementation',
        booleanOps('false'),
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns false if the right operand is true', () => {
    expectWriterTreeNode(
      nor(variable('x'), boolean(true)),
      boolean(false)
    )(
      ...norOps(
        'joint deniable annihilator',
        variableOps('x'),
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('returns false if the left operand is true', () => {
    expectWriterTreeNode(
      nor(boolean(true), variable('x')),
      boolean(false)
    )(
      ...norOps(
        'joint deniable annihilator',
        booleanOps('true'),
        variableOps('x'),
        booleanOps('false')
      )
    )
  })

  it('returns the complement of the left operand if left is equivalent to right', () => {
    expectWriterTreeNode(
      nor(variable('x'), variable('x')),
      not(variable('x'))
    )(
      ...norOps(
        'joint deniable complementation',
        variableOps('x'),
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns a conjunction of mutually complemented operands', () => {
    expectWriterTreeNode(
      nor(not(variable('x')), not(variable('y'))),
      and(variable('x'), variable('y'))
    )(
      ...norOps(
        'De Morgan',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        notOps(
          'created complement',
          variableOps('y'),
          []
        ),
        andOps(
          'created conjunction',
          variableOps('x'),
          variableOps('y'),
          []
        )
      )
    )
  })

  it('returns false if the right operand is the complement of the left', () => {
    expectWriterTreeNode(
      nor(variable('x'), not(variable('x'))),
      boolean(false)
    )(
      ...norOps(
        'joint deniable annihilator',
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        booleanOps('false')
      )
    )
  })

  it('returns false if the left operand is the complement of the right', () => {
    expectWriterTreeNode(
      nor(not(variable('x')), variable('x')),
      boolean(false)
    )(
      ...norOps(
        'joint deniable annihilator',
        notOps(
          'created complement',
          variableOps('x'),
          []
        ),
        variableOps('x'),
        booleanOps('false')
      )
    )
  })

  it('returns a JointDenial on variable input', () => {
    expectWriterTreeNode(
      nor(variable('x'), variable('y')),
      $nor(variable('x'), variable('y'))[0]
    )(
      ...norOps(
        'created joint denial',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
