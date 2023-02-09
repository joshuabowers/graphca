import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  booleanOps, variableOps, xnorOps, notOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { xnor, $xnor } from './biconditional'

describe('$xnor', () => {
  it('generates a Biconditional for a pair of TreeNode inputs', () => {
    expect(
      $xnor(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.xnor,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('xnor', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      xnor(boolean(true), boolean(true)),
      boolean(true)
    )(
      ...xnorOps(
        'biconditional identity',
        booleanOps('true'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      xnor(boolean(false), boolean(true)),
      boolean(false)
    )(
      ...xnorOps(
        'biconditional identity',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('false')
      )
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      xnor(boolean(true), boolean(false)),
      boolean(false)
    )(
      ...xnorOps(
        'biconditional identity',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      xnor(boolean(false), boolean(false)),
      boolean(true)
    )(
      ...xnorOps(
        'biconditional complementation',
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

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      xnor(boolean(true), variable('x')),
      variable('x')
    )(
      ...xnorOps(
        'biconditional identity',
        booleanOps('true'),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriterTreeNode(
      xnor(variable('x'), boolean(true)),
      variable('x')
    )(
      ...xnorOps(
        'biconditional identity',
        variableOps('x'),
        booleanOps('true'),
        variableOps('x')
      )
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectWriterTreeNode(
      xnor(boolean(false), variable('x')),
      not(variable('x'))
    )(
      ...xnorOps(
        'biconditional complementation',
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

  it('returns the complement of the left if the right is false', () => {
    expectWriterTreeNode(
      xnor(variable('x'), boolean(false)),
      not(variable('x'))
    )(
      ...xnorOps(
        'biconditional complementation',
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

  it('returns true if the operands are equal', () => {
    expectWriterTreeNode(
      xnor(variable('x'), variable('x')),
      boolean(true)
    )(
      ...xnorOps(
        'biconditional annihilator',
        variableOps('x'),
        variableOps('x'),
        booleanOps('true')
      )
    )
  })

  it('returns a Biconditional on variable input', () => {
    expectWriterTreeNode(
      xnor(variable('x'), variable('y')),
      $xnor(variable('x'), variable('y'))[0]
    )(
      ...xnorOps(
        'created biconditional',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
