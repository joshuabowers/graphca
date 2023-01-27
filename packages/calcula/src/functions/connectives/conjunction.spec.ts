import { unit } from '../../monads/writer'
import { expectWriterTreeNode } from '../../utility/expectations'
import { Clades, Genera, Species } from '../../utility/tree'
import { real, complex, boolean } from '../../primitives'
import { variable } from '../../variable'
import { not } from './complement'
import { or } from './disjunction'
import { and, $and } from './conjunction'
import { Unicode } from '../../Unicode'

describe('$and', () => {
  it('generates a Conjunction for a pair of TreeNode inputs', () => {
    expect(
      $and(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.connective, species: Species.and,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('and', () => {
  it('returns true when given two true things', () => {
    expectWriterTreeNode(
      and(boolean(true), boolean(true)),
      boolean(true)
    )(
      ['true', 'true', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `true ${Unicode.and} true`,
        'true',
        'conjunctive identity'
      ]
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriterTreeNode(
      and(boolean(false), boolean(true)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['true', 'true', 'given primitive'],
      [
        `false ${Unicode.and} true`,
        'false',
        'conjunctive identity'
      ]
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriterTreeNode(
      and(boolean(true), boolean(false)),
      boolean(false)
    )(
      ['true', 'true', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `true ${Unicode.and} false`,
        'false',
        'conjunctive identity'
      ]
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriterTreeNode(
      and(boolean(false), boolean(false)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      [
        `false ${Unicode.and} false`,
        'false',
        'conjunctive annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriterTreeNode(
      and(real(5), real(0)),
      boolean(false)
    )(
      ['5', '5', 'given primitive'],
      ['0', '0', 'given primitive'],
      [
        `5 ${Unicode.and} 0`,
        'false',
        'real conjunction'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expectWriterTreeNode(
      and(complex([5,0]), complex([0,0])),
      boolean(false)
    )(
      [`5+0${Unicode.i}`, `5+0${Unicode.i}`, 'given primitive'],
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive'],
      [
        `5+0${Unicode.i} ${Unicode.and} 0+0${Unicode.i}`,
        'false',
        'complex conjunction'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriterTreeNode(
      and(variable('x'), boolean(true)),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['true', 'true', 'given primitive'],
      [
        `x ${Unicode.and} true`,
        'x',
        'conjunctive identity'
      ]
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriterTreeNode(
      and(boolean(true), variable('x')),
      variable('x')
    )(
      ['true', 'true', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `true ${Unicode.and} x`,
        'x',
        'conjunctive identity'
      ]
    )
  })

  it('returns the false if the right operand is false', () => {
    expectWriterTreeNode(
      and(variable('x'), boolean(false)),
      boolean(false)
    )(
      ['x', 'x', 'given variable'],
      ['false', 'false', 'given primitive'],
      [
        `x ${Unicode.and} false`,
        'false',
        'conjunctive annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false if the left operand is false', () => {
    expectWriterTreeNode(
      and(boolean(false), variable('x')),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['x', 'x', 'given variable'],
      [
        `false ${Unicode.and} x`,
        'false',
        'conjunctive annihilator'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns the left operand if left equivalent to right', () => {
    expectWriterTreeNode(
      and(variable('x'), variable('x')),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `x ${Unicode.and} x`,
        'x',
        'conjunctive idempotency'
      ]
    )
  })

  // See (e.g.): https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
  // x | y | x or y | x and (x or y) | x and x | x and y | (x and x) or (x and y)
  // ----------------------------------------------------------------------------
  // F | F | F      | F              | F       | F       | F 
  // F | T | T      | F              | F       | F       | F
  // T | F | T      | T              | T       | F       | T
  // T | T | T      | T              | T       | T       | T
  it('returns the left operand if the right is a Disjunction of the left', () => {
    expectWriterTreeNode(
      and(variable('x'), or(variable('x'), variable('y'))),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.or} y`,
        `(x${Unicode.or}y)`,
        'disjunction'
      ],
      [
        `x ${Unicode.and} (x${Unicode.or}y)`,
        'x',
        'conjunctive absorption'
      ]
    )
    expectWriterTreeNode(
      and(variable('x'), or(variable('y'), variable('x'))),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `y ${Unicode.or} x`,
        `(y${Unicode.or}x)`,
        'disjunction'
      ],
      [
        `x ${Unicode.and} (y${Unicode.or}x)`,
        'x',
        'conjunctive absorption'
      ]
    )
  })

  it('returns the right operand if the left is a Disjunction of the right', () => {
    expectWriterTreeNode(
      and(or(variable('x'), variable('y')), variable('x')),
      variable('x')
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.or} y`,
        `(x${Unicode.or}y)`,
        'disjunction'
      ],
      ['x', 'x', 'given variable'],
      [
        `(x${Unicode.or}y) ${Unicode.and} x`,
        'x',
        'conjunctive absorption'
      ]
    )
    expectWriterTreeNode(
      and(or(variable('y'), variable('x')), variable('x')),
      variable('x')
    )(
      ['y', 'y', 'given variable'],
      ['x', 'x', 'given variable'],
      [
        `y ${Unicode.or} x`,
        `(y${Unicode.or}x)`,
        'disjunction'
      ],
      ['x', 'x', 'given variable'],
      [
        `(y${Unicode.or}x) ${Unicode.and} x`,
        'x',
        'conjunctive absorption'
      ]
    )
  })

  it('returns false if the right operand is the negation of the left', () => {
    expectWriterTreeNode(
      and(variable('x'), not(variable('x'))),
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
        `x ${Unicode.and} ${Unicode.not}(x)`,
        'false',
        'contradiction'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false if the left operand is the negation of the right', () => {
    expectWriterTreeNode(
      and(not(variable('x')), variable('x')),
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
        `${Unicode.not}(x) ${Unicode.and} x`,
        'false',
        'contradiction'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns a Conjunction on variable input', () => {
    expectWriterTreeNode(
      and(variable('x'), variable('y')),
      $and(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      [
        `x ${Unicode.and} y`,
        `(x${Unicode.and}y)`,
        'conjunction'
      ]
    )
  })
})
