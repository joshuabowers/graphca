import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  booleanOps, variableOps, impliesOps, notOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { implies, $implies } from './implication'

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
      ...impliesOps(
        'implicative identity',
        booleanOps('true'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriterTreeNode(
      implies(boolean(false), boolean(true)),
      boolean(true)
    )(
      ...impliesOps(
        'implicative annihilator',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      implies(boolean(true), boolean(false)),
      boolean(false)
    )(
      ...impliesOps(
        'implicative identity',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      implies(boolean(false), boolean(false)),
      boolean(true)
    )(
      ...impliesOps(
        'implicative annihilator',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      implies(boolean(true), variable('x')),
      variable('x')
    )(
      ...impliesOps(
        'implicative identity',
        booleanOps('true'),
        variableOps('x'),
        variableOps('x'),
      )
    )
  })

  it('returns true if the right operand is true', () => {
    expectWriterTreeNode(
      implies(variable('x'), boolean(true)),
      boolean(true)
    )(
      ...impliesOps(
        'implicative annihilator',
        variableOps('x'),
        booleanOps('true'),
        booleanOps('true'),
      )
    )
  })

  it('returns true if the left operand is false', () => {
    expectWriterTreeNode(
      implies(boolean(false), variable('x')),
      boolean(true)
    )(
      ...impliesOps(
        'implicative annihilator',
        booleanOps('false'),
        variableOps('x'),
        booleanOps('true'),
      )
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectWriterTreeNode(
      implies(variable('x'), boolean(false)),
      not(variable('x'))
    )(
      ...impliesOps(
        'implicative complementation',
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
  
  it('returns an Implication on variable input', () => {
    expectWriterTreeNode(
      implies(variable('x'), variable('y')),
      $implies(variable('x'), variable('y'))[0]
    )(
      ...impliesOps(
        'created implication',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
