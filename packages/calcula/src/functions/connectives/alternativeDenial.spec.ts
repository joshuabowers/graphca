import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { implies } from './implication'
import { nand, $nand } from './alternativeDenial'
import { Unicode } from '../../Unicode'

describe('$nand', () => {
  it('generates an AlternativeDenial for a pair of TreeNode inputs', () => {
    expect(
      $nand(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.nand,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('nand', () => {
  it('returns false when given two true things', () => {
    expectWriterTreeNode(
      nand(boolean(true), boolean(true)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.nand} true`, 
        `${Unicode.not}(true)`, 
        'alternative deniable complementation'
      ],
      [`${Unicode.not}(true)`, 'false', 'boolean complement'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true if the left argument is false', () => {
    expectWriterTreeNode(
      nand(boolean(false), boolean(true)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.nand} true`,
        `${Unicode.not}(false)`,
        'alternative deniable complementation'
      ],
      [`${Unicode.not}(false)`, 'true', 'boolean complement'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the right argument is false', () => {
    expectWriterTreeNode(
      nand(boolean(true), boolean(false)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.nand} false`, 
        `${Unicode.not}(false)`, 
        'alternative deniable complementation'
      ],
      [`${Unicode.not}(false)`, 'true', 'boolean complement'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if both arguments are false', () => {
    expectWriterTreeNode(
      nand(boolean(false), boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.nand} false`,
        'true',
        'alternative deniable annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the complement of left operand if the right is true', () => {
    expectWriterTreeNode(
      nand(variable('x'), boolean(true)),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.nand} true`, 
        `${Unicode.not}(x)`, 
        'alternative deniable complementation'
      ],
      [`${Unicode.not}(x)`, `${Unicode.not}(x)`, 'complement']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      nand(boolean(true), variable('x')),
      not(variable('x'))
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.nand} x`,
        `${Unicode.not}(x)`,
        'alternative deniable complementation'
      ],
      [`${Unicode.not}(x)`, `${Unicode.not}(x)`, 'complement']
    )
  })

  it('returns the true if the right operand is false', () => {
    expectWriterTreeNode(
      nand(variable('x'), boolean(false)),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [`x ${Unicode.nand} false`, 'true', 'alternative deniable annihilator'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left operand is false', () => {
    expectWriterTreeNode(
      nand(boolean(false), variable('x')),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [`false ${Unicode.nand} x`, 'true', 'alternative deniable annihilator'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the complement of the left operand if left equivalent to right', () => {
    expectWriterTreeNode(
      nand(variable('x'), variable('x')),
      not(variable('x'))
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `x ${Unicode.nand} x`, 
        `${Unicode.not}(x)`, 
        'alternative deniable complementation'
      ],
      [`${Unicode.not}(x)`, `${Unicode.not}(x)`, 'complement']
    )
  })

  it('returns an implication if the right operand is a nand of the left', () => {
    expectWriterTreeNode(
      nand(variable('x'), nand(variable('x'), variable('y'))),
      implies(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [`x ${Unicode.nand} y`, `(x${Unicode.nand}y)`, 'alternative denial'],
      [
        `x ${Unicode.nand} (x${Unicode.nand}y)`, 
        `x ${Unicode.implies} y`,
        'alternative deniable implication'
      ],
      [`x ${Unicode.implies} y`, `(x${Unicode.implies}y)`, 'implication']
    )
    expectWriterTreeNode(
      nand(variable('x'), nand(variable('y'), variable('x'))),
      implies(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x', 'x', 'given variable'],
      [`y ${Unicode.nand} x`, `(y${Unicode.nand}x)`, 'alternative denial'],
      [
        `x ${Unicode.nand} (y${Unicode.nand}x)`,
        `x ${Unicode.implies} y`,
        'alternative deniable implication'
      ],
      [`x ${Unicode.implies} y`, `(x${Unicode.implies}y)`, 'implication']
    )
  })

  it('returns a disjunction of mutually complemented operands', () => {
    expectWriterTreeNode(
      nand(not(variable('x')), not(variable('y'))),
      or(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      [`${Unicode.not}(x)`, `${Unicode.not}(x)`, 'complement'],
      ['y', 'y', 'given variable'],
      [`${Unicode.not}(y)`, `${Unicode.not}(y)`, 'complement'],
      [
        `${Unicode.not}(x) ${Unicode.nand} ${Unicode.not}(y)`, 
        `x ${Unicode.or} y`, 
        'De Morgan'
      ],
      [`x ${Unicode.or} y`, `(x${Unicode.or}y)`, 'disjunction']
    )
  })

  it('returns true if the right operand is the complement of the left', () => {
    expectWriterTreeNode(
      nand(variable('x'), not(variable('x'))),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [`${Unicode.not}(x)`, `${Unicode.not}(x)`, 'complement'],
      [
        `x ${Unicode.nand} ${Unicode.not}(x)`,
        'true',
        'alternative deniable annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left operand is the complement of the right', () => {
    expectWriterTreeNode(
      nand(not(variable('x')), variable('x')),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      [`${Unicode.not}(x)`, `${Unicode.not}(x)`, 'complement'],
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x) ${Unicode.nand} x`,
        'true',
        'alternative deniable annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a AlternativeDenial on variable input', () => {
    expectWriterTreeNode(
      nand(variable('x'), variable('y')),
      $nand(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [`x ${Unicode.nand} y`, `(x${Unicode.nand}y)`, 'alternative denial']
    )
  })
})
