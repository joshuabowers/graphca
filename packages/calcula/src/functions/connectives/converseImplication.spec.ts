import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  booleanOps, variableOps, converseOps, notOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { converse, $converse } from './converseImplication'

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
      ...converseOps(
        'converse implication annihilator',
        booleanOps('true'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      converse(boolean(false), boolean(true)),
      boolean(false)
    )(
      ...converseOps(
        'converse implication identity',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriterTreeNode(
      converse(boolean(true), boolean(false)),
      boolean(true)
    )(
      ...converseOps(
        'converse implication annihilator',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      converse(boolean(false), boolean(false)),
      boolean(true)
    )(
      ...converseOps(
        'converse implication complementation',
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

  it('returns true if the left operand is true', () => {
    expectWriterTreeNode(
      converse(boolean(true), variable('x')),
      boolean(true)
    )(
      ...converseOps(
        'converse implication annihilator',
        booleanOps('true'),
        variableOps('x'),
        booleanOps('true')
      )
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriterTreeNode(
      converse(variable('x'), boolean(true)),
      variable('x')
    )(
      ...converseOps(
        'converse implication identity',
        variableOps('x'),
        booleanOps('true'),
        variableOps('x')
      )
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectWriterTreeNode(
      converse(boolean(false), variable('x')),
      not(variable('x'))
    )(
      ...converseOps(
        'converse implication complementation',
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

  it('returns true if the right operand is false', () => {
    expectWriterTreeNode(
      converse(variable('x'), boolean(false)),
      boolean(true)
    )(
      ...converseOps(
        'converse implication annihilator',
        variableOps('x'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns a ConverseImplication on variable input', () => {
    expectWriterTreeNode(
      converse(variable('x'), variable('y')),
      $converse(variable('x'), variable('y'))[0]
    )(
      ...converseOps(
        'created converse implication',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
