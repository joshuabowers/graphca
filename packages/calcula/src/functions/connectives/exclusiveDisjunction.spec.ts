import { unit } from '../../monads/writer'
import { 
  expectWriterTreeNode,
  booleanOps, variableOps, xorOps, notOps
} from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { xor, $xor } from './exclusiveDisjunction'

describe('$xor', () => {
  it('generates a Exclusive Disjunction for a pair of TreeNode inputs', () => {
    expect(
      $xor(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.xor,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('xor', () => {
  it('returns false when given two true things', () => {
    expectWriterTreeNode(
      xor(boolean(true), boolean(true)),
      boolean(false)
    )(
      ...xorOps(
        'exclusive disjunctive complementation',
        booleanOps('true'),
        booleanOps('true'),
        notOps(
          'boolean complement',
          booleanOps('true'),
          booleanOps('false')
        )
      )
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriterTreeNode(
      xor(boolean(false), boolean(true)),
      boolean(true)
    )(
      ...xorOps(
        'exclusive disjunctive identity',
        booleanOps('false'),
        booleanOps('true'),
        booleanOps('true')
      )
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriterTreeNode(
      xor(boolean(true), boolean(false)),
      boolean(true)
    )(
      ...xorOps(
        'exclusive disjunctive identity',
        booleanOps('true'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriterTreeNode(
      xor(boolean(false), boolean(false)),
      boolean(false)
    )(
      ...xorOps(
        'exclusive disjunctive identity',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns the right operand if the left is false', () => {
    expectWriterTreeNode(
      xor(boolean(false), variable('x')),
      variable('x')
    )(
      ...xorOps(
        'exclusive disjunctive identity',
        booleanOps('false'),
        variableOps('x'),
        variableOps('x')
      )
    )
  })

  it('returns the left operand if the right is false', () => {
    expectWriterTreeNode(
      xor(variable('x'), boolean(false)),
      variable('x')
    )(
      ...xorOps(
        'exclusive disjunctive identity',
        variableOps('x'),
        booleanOps('false'),
        variableOps('x')
      )
    )
  })

  it('returns the complement of the right if the left is true', () => {
    expectWriterTreeNode(
      xor(boolean(true), variable('x')),
      not(variable('x'))
    )(
      ...xorOps(
        'exclusive disjunctive complementation',
        booleanOps('true'),
        variableOps('x'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns the complement of the left if the right is true', () => {
    expectWriterTreeNode(
      xor(variable('x'), boolean(true)),
      not(variable('x'))
    )(
      ...xorOps(
        'exclusive disjunctive complementation',
        variableOps('x'),
        booleanOps('true'),
        notOps(
          'created complement',
          variableOps('x'),
          []
        )
      )
    )
  })

  it('returns false if the left and right operands are equal', () => {
    expectWriterTreeNode(
      xor(variable('x'), variable('x')),
      boolean(false)
    )(
      ...xorOps(
        'exclusive disjunctive annihilator',
        variableOps('x'),
        variableOps('x'),
        booleanOps('false')
      )
    )
  })

  it('returns a ExclusiveDisjunction on variable input', () => {
    expectWriterTreeNode(
      xor(variable('x'), variable('y')),
      $xor(variable('x'), variable('y'))[0]
    )(
      ...xorOps(
        'created exclusive disjunction',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })  
})
