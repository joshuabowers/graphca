import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { xnor, $xnor } from './biconditional'
import { Unicode } from '../../Unicode'

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
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.xnor} true`,
        `true`,
        'biconditional identity'
      ],
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      xnor(boolean(false), boolean(true)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.xnor} true`,
        'false',
        'biconditional identity'
      ]
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      xnor(boolean(true), boolean(false)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.xnor} false`,
        'false',
        'biconditional identity'
      ]
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      xnor(boolean(false), boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.xnor} false`,
        `${Unicode.not}(false)`,
        'biconditional complementation'
      ],
      [
        `${Unicode.not}(false)`,
        'true',
        'boolean complement'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      xnor(boolean(true), variable('x')),
      variable('x')
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.xnor} x`,
        'x',
        'biconditional identity'
      ]
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriterTreeNode(
      xnor(variable('x'), boolean(true)),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.xnor} true`,
        'x',
        'biconditional identity'
      ]
    )
  })

  it('returns the complement of the right if the left is false', () => {
    expectWriterTreeNode(
      xnor(boolean(false), variable('x')),
      not(variable('x'))
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.xnor} x`,
        `${Unicode.not}(x)`,
        'biconditional complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns the complement of the left if the right is false', () => {
    expectWriterTreeNode(
      xnor(variable('x'), boolean(false)),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.xnor} false`,
        `${Unicode.not}(x)`,
        'biconditional complementation'
      ],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ]
    )
  })

  it('returns true if the operands are equal', () => {
    expectWriterTreeNode(
      xnor(variable('x'), variable('x')),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `x ${Unicode.xnor} x`,
        'true',
        'biconditional annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a Biconditional on variable input', () => {
    expectWriterTreeNode(
      xnor(variable('x'), variable('y')),
      $xnor(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [`x ${Unicode.xnor} y`, `(x${Unicode.xnor}y)`, 'biconditional']
    )
  })
})
