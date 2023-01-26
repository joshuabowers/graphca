import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'
import { converse } from './converseImplication'
import { or, $or } from './disjunction'
import { Unicode } from '../../Unicode'

describe('$or', () => {
  it('generates a Disjunction for a pair of TreeNode inputs', () => {
    expect(
      $or(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.or,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('or', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      or(boolean(true), boolean(true)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.or} true`,
        'true',
        'disjunctive annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left argument is true', () => {
    expectWriterTreeNode(
      or(boolean(true), boolean(false)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.or} false`,
        'true',
        'disjunctive identity'
      ]
    )
  })

  it('returns true if the right argument is true', () => {
    expectWriterTreeNode(
      or(boolean(false), boolean(true)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.or} true`,
        'true',
        'disjunctive identity'
      ]
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriterTreeNode(
      or(boolean(false), boolean(false)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.or} false`,
        'false',
        'disjunctive identity'
      ]
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriterTreeNode(
      or(real(5), real(0)),
      boolean(true)
    )(
      ['5', '5', 'given primitive'],
      ['0', '0', 'given primitive'],
      [
        `5 ${Unicode.or} 0`,
        'true',
        'real disjunction'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expectWriterTreeNode(
      or(complex([5, 0]), complex([0, 0])),
      boolean(true)
    )(
      [`5+0${Unicode.i}`, `5+0${Unicode.i}`, 'given primitive'],
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive'],
      [
        `5+0${Unicode.i} ${Unicode.or} 0+0${Unicode.i}`,
        'true',
        'complex disjunction'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the left operand if the right is false', () => {
    expectWriterTreeNode(
      or(variable('x'), boolean(false)),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.or} false`,
        'x',
        'disjunctive identity'
      ]
    )
  })

  it('returns the right operand if the left is false', () => {
    expectWriterTreeNode(
      or(boolean(false), variable('x')),
      variable('x')
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.or} x`,
        'x',
        'disjunctive identity'
      ]
    )
  })

  it('returns true if the right operand is true', () => {
    expectWriterTreeNode(
      or(variable('x'), boolean(true)),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.or} true`,
        'true',
        'disjunctive annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left operand is true', () => {
    expectWriterTreeNode(
      or(boolean(true), variable('x')),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.or} x`,
        'true',
        'disjunctive annihilator'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns the left operand if left is equivalent to right', () => {
    expectWriterTreeNode(
      or(variable('x'), variable('x')),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `x ${Unicode.or} x`,
        'x',
        'disjunctive idempotency'
      ]
    )
  })

  it('returns the left operand if the right is a left-child Conjunction of the left', () => {
    expectWriterTreeNode(
      or(variable('x'), and(variable('x'), variable('y'))),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.and} y`,
        `(x${Unicode.and}y)`,
        'conjunction'
      ],
      [
        `x ${Unicode.or} (x${Unicode.and}y)`,
        'x',
        'disjunctive absorption'
      ]
    )
  })

  it('returns the left operand if the right is a right-child Conjunction of the left', () => {
    expectWriterTreeNode(
      or(variable('x'), and(variable('y'), variable('x'))),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `y ${Unicode.and} x`,
        `(y${Unicode.and}x)`,
        'conjunction'
      ],
      [
        `x ${Unicode.or} (y${Unicode.and}x)`,
        'x',
        'disjunctive absorption'
      ]
    )
  })

  it('returns the right operand if the left is a left-child Conjunction of the right', () => {
    expectWriterTreeNode(
      or(and(variable('x'), variable('y')), variable('x')),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.and} y`,
        `(x${Unicode.and}y)`,
        'conjunction'
      ],
      ['x', 'x', 'given variable'],
      [
        `(x${Unicode.and}y) ${Unicode.or} x`,
        'x',
        'disjunctive absorption'
      ]
    )
  })

  it('returns the right operand if the left is a right-child Conjunction of the right', () => {
    expectWriterTreeNode(
      or(and(variable('y'), variable('x')), variable('x')),
      variable('x')
    )(
      ['y', 'y', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `y ${Unicode.and} x`,
        `(y${Unicode.and}x)`,
        'conjunction'
      ],
      ['x', 'x', 'given variable'],
      [
        `(y${Unicode.and}x) ${Unicode.or} x`,
        'x',
        'disjunctive absorption'
      ]
    )
  })

  it('returns true if the right operand is the negation of the left', () => {
    expectWriterTreeNode(
      or(variable('x'), not(variable('x'))),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      [
        `x ${Unicode.or} ${Unicode.not}(x)`,
        'true',
        'disjunctive complementation'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true if the left operand is the negation of the right', () => {
    expectWriterTreeNode(
      or(not(variable('x')), variable('x')),
      boolean(true)
    )(
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x) ${Unicode.or} x`,
        'true',
        'disjunctive complementation'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns an implication if the left operand is a complement', () => {
    expectWriterTreeNode(
      or(not(variable('x')), variable('y')),
      implies(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      [
        `${Unicode.not}(x)`,
        `${Unicode.not}(x)`,
        'complement'
      ],
      ['y', 'y', 'given variable'],
      [
        `${Unicode.not}(x) ${Unicode.or} y`,
        `x ${Unicode.implies} y`,
        'disjunctive implication'
      ],
      [
        `x ${Unicode.implies} y`,
        `(x${Unicode.implies}y)`,
        'implication'
      ]
    )
  })

  it('returns a converse if the right operand is a complement', () => {
    expectWriterTreeNode(
      or(variable('x'), not(variable('y'))),
      converse(variable('x'), variable('y'))
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `${Unicode.not}(y)`,
        `${Unicode.not}(y)`,
        'complement'
      ],
      [
        `x ${Unicode.or} ${Unicode.not}(y)`,
        `x ${Unicode.converse} y`,
        'disjunctive converse implication'
      ],
      [
        `x ${Unicode.converse} y`,
        `(x${Unicode.converse}y)`,
        'converse implication'
      ]
    )
  })

  it('returns a Disjunction on variable input', () => {
    expectWriterTreeNode(
      or(variable('x'), variable('y')),
      $or(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.or} y`,
        `(x${Unicode.or}y)`,
        'disjunction'
      ]
    )
  })
})
