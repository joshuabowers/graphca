import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { xor, $xor } from './exclusiveDisjunction'
import { Unicode } from '../../Unicode'

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
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.xor} true`,
        `${Unicode.not}(true)`,
        'exclusive disjunctive complementation'
      ],
      [
        `${Unicode.not}(true)`,
        'false',
        'boolean complement'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriterTreeNode(
      xor(boolean(false), boolean(true)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.xor} true`,
        'true',
        'exclusive disjunctive identity'
      ]
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriterTreeNode(
      xor(boolean(true), boolean(false)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.xor} false`,
        'true',
        'exclusive disjunctive identity'
      ]
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriterTreeNode(
      xor(boolean(false), boolean(false)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.xor} false`,
        'false',
        'exclusive disjunctive identity'
      ]
    )
  })

  it('returns the right operand if the left is false', () => {
    expectWriterTreeNode(
      xor(boolean(false), variable('x')),
      variable('x')
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.xor} x`,
        'x',
        'exclusive disjunctive identity'
      ]
    )
  })

  it('returns the left operand if the right is false', () => {
    expectWriterTreeNode(
      xor(variable('x'), boolean(false)),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.xor} false`,
        'x',
        'exclusive disjunctive identity'
      ]
    )
  })

  it('returns the complement of the right if the left is true', () => {
    expectWriterTreeNode(
      xor(boolean(true), variable('x')),
      not(variable('x'))
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.xor} x`,
        `${Unicode.not}(x)`,
        'exclusive disjunctive complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns the complement of the left if the right is true', () => {
    expectWriterTreeNode(
      xor(variable('x'), boolean(true)),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.xor} true`,
        `${Unicode.not}(x)`,
        'exclusive disjunctive complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns false if the left and right operands are equal', () => {
    expectWriterTreeNode(
      xor(variable('x'), variable('x')),
      boolean(false)
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `x ${Unicode.xor} x`,
        'false',
        'exclusive disjunctive annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns a ExclusiveDisjunction on variable input', () => {
    expectWriterTreeNode(
      xor(variable('x'), variable('y')),
      $xor(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.xor} y`,
        `(x${Unicode.xor}y)`,
        'exclusive disjunction'
      ]
    )
  })  
})
