import { unit } from '../monads/writer'
import { expectWriterTreeNode } from '../utility/expectations';
import { Clades, Genera, Species } from '../utility/tree';
import { real, complex, boolean } from '../primitives';
import { variable } from '../variable'
import {
  equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals, 
  $equals, $notEquals, $lessThan, $greaterThan, $lessThanEquals, $greaterThanEquals
} from "./inequality";
import { Unicode } from '../Unicode'

describe('$equals', () => {
  it('generates an Equality for a pair of TreeNode inputs', () => {
    expect(
      $equals(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.inequalities, species: Species.equals,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('equals', () => {
  it('returns true for two equal reals', () => {
    expectWriterTreeNode(
      equals(real(1), real(1)),
      boolean(true)
    )(
      ['1', '1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['1 === 1', 'true', 'real equality'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true for two equal complexes', () => {
    expectWriterTreeNode(
      equals(complex([1,1]), complex([1,1])),
      boolean(true)
    )(
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [
        `1+1${Unicode.i} === 1+1${Unicode.i}`,
        'true',
        'complex equality'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true for two equal booleans', () => {
    expectWriterTreeNode(
      equals(boolean(false), boolean(false)),
      boolean(true)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      ['false === false', 'true', 'boolean equality'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for unequal things', () => {
    expectWriterTreeNode(
      equals(real(1), real(2)),
      boolean(false)
    )(
      ['1', '1', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['1 === 2', 'false', 'real equality'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns an Equals for variable input', () => {
    expectWriterTreeNode(
      equals(variable('x'), variable('y')),
      $equals(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x === y', '(x===y)', 'equality']
    )
  })
})

describe('$notEquals', () => {
  it('generates an Inequality for a pair of TreeNode inputs', () => {
    expect(
      $notEquals(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.inequalities, species: Species.notEquals,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('notEquals', () => {
  it('returns false for two equal reals', () => {
    expectWriterTreeNode(
      notEquals(real(1), real(1)),
      boolean(false)
    )(
      ['1', '1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['1 !== 1', 'false', 'real inequality'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false for two equal complexes', () => {
    expectWriterTreeNode(
      notEquals(complex([1,1]), complex([1,1])),
      boolean(false)
    )(
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [
        `1+1${Unicode.i} !== 1+1${Unicode.i}`,
        'false',
        'complex inequality'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false for two equal booleans', () => {
    expectWriterTreeNode(
      notEquals(boolean(false), boolean(false)),
      boolean(false)
    )(
      ['false', 'false', 'given primitive'],
      ['false', 'false', 'given primitive'],
      ['false !== false', 'false', 'boolean inequality'],
      ['false', 'false', 'given primitive']
    )
    expect(notEquals(boolean(false), boolean(false)).value).toEqual(boolean(false).value)
  })

  it('returns true for unequal things', () => {
    expectWriterTreeNode(
      notEquals(real(1), real(2)),
      boolean(true)
    )(
      ['1', '1', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['1 !== 2', 'true', 'real inequality'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a NotEquals for variable input', () => {
    expectWriterTreeNode(
      notEquals(variable('x'), variable('y')),
      $notEquals(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x !== y', '(x!==y)', 'inequality']
    )
  })
})

describe('$lessThan', () => {
  it('generates a LessThan for a pair of TreeNode inputs', () => {
    expect(
      $lessThan(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.inequalities, species: Species.lessThan,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('lessThan', () => {
  it('returns true for two ordered reals', () => {
    expectWriterTreeNode(
      lessThan(real(1), real(2)),
      boolean(true)
    )(
      ['1', '1', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['1 < 2', 'true', 'real less than'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for two unordered reals', () => {
    expectWriterTreeNode(
      lessThan(real(2), real(1)),
      boolean(false)
    )(
      ['2', '2', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['2 < 1', 'false', 'real less than'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false for two equal inputs', () => {
    expectWriterTreeNode(
      lessThan(real(1), real(1)),
      boolean(false)
    )(
      ['1', '1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['1 < 1', 'false', 'real less than'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true for two complexes ordered by length', () => {
    expectWriterTreeNode(
      lessThan(complex([1, 1]), complex([5, 5])),
      boolean(true)
    )(
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [
        `1+1${Unicode.i} < 5+5${Unicode.i}`,
        'true',
        'complex less than'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      lessThan(complex([5, 5]), complex([1, 1])),
      boolean(false)
    )(
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [
        `5+5${Unicode.i} < 1+1${Unicode.i}`,
        'false',
        'complex less than'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns a LessThan for variable input', () => {
    expectWriterTreeNode(
      lessThan(variable('x'), variable('y')),
      $lessThan(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x < y', '(x<y)', 'less than']
    )
  })
})

describe('$greaterThan', () => {
  it('generates a GreaterThan for a pair of TreeNode inputs', () => {
    expect(
      $greaterThan(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.inequalities, species: Species.greaterThan,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('greaterThan', () => {
  it('returns false for two ordered reals', () => {
    expectWriterTreeNode(
      greaterThan(real(1), real(2)),
      boolean(false)
    )(
      ['1', '1', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['1 > 2', 'false', 'real greater than'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true for two unordered reals', () => {
    expectWriterTreeNode(
      greaterThan(real(2), real(1)),
      boolean(true)
    )(
      ['2', '2', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['2 > 1', 'true', 'real greater than'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for two equal inputs', () => {
    expectWriterTreeNode(
      greaterThan(real(1), real(1)),
      boolean(false)
    )(
      ['1', '1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['1 > 1', 'false', 'real greater than'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns false for two complexes ordered by length', () => {
    expectWriterTreeNode(
      greaterThan(complex([1, 1]), complex([5, 5])),
      boolean(false)
    )(
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [
        `1+1${Unicode.i} > 5+5${Unicode.i}`,
        'false',
        'complex greater than'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      greaterThan(complex([5, 5]), complex([1, 1])),
      boolean(true)
    )(
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [
        `5+5${Unicode.i} > 1+1${Unicode.i}`,
        'true',
        'complex greater than'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a GreaterThan for variable input', () => {
    expectWriterTreeNode(
      greaterThan(variable('x'), variable('y')),
      $greaterThan(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x > y', '(x>y)', 'greater than']
    )
  })
})

describe('$lessThanEquals', () => {
  it('generates a LessThanEquals for a pair of TreeNode inputs', () => {
    expect(
      $lessThanEquals(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.inequalities, species: Species.lessThanEquals,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('lessThanEquals', () => {
  it('returns true for two ordered reals', () => {
    expectWriterTreeNode(
      lessThanEquals(real(1), real(2)),
      boolean(true)
    )(
      ['1', '1', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['1 <= 2', 'true', 'real less than equals'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for two unordered reals', () => {
    expectWriterTreeNode(
      lessThanEquals(real(2), real(1)),
      boolean(false)
    )(
      ['2', '2', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['2 <= 1', 'false', 'real less than equals'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true for two equal inputs', () => {
    expectWriterTreeNode(
      lessThanEquals(real(1), real(1)),
      boolean(true)
    )(
      ['1', '1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['1 <= 1', 'true', 'real less than equals'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true for two complexes ordered by length', () => {
    expectWriterTreeNode(
      lessThanEquals(complex([1, 1]), complex([5, 5])),
      boolean(true)
    )(
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [
        `1+1${Unicode.i} <= 5+5${Unicode.i}`,
        'true',
        'complex less than equals'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      lessThanEquals(complex([5, 5]), complex([1, 1])),
      boolean(false)
    )(
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [
        `5+5${Unicode.i} <= 1+1${Unicode.i}`,
        'false',
        'complex less than equals'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns a LessThanEquals for variable input', () => {
    expectWriterTreeNode(
      lessThanEquals(variable('x'), variable('y')),
      $lessThanEquals(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x <= y', '(x<=y)', 'less than equals']
    )
  })
})

describe('$greaterThanEquals', () => {
  it('generates a GreaterThanEquals for a pair of TreeNode inputs', () => {
    expect(
      $greaterThanEquals(unit(variable('x').value), unit(variable('y').value))[0]
    ).toEqual({
      clade: Clades.binary, genus: Genera.inequalities, species: Species.greaterThanEquals,
      left: unit(variable('x').value), right: unit(variable('y').value)
    })
  })
})

describe('greaterThanEquals', () => {
  it('returns false for two ordered reals', () => {
    expectWriterTreeNode(
      greaterThanEquals(real(1), real(2)),
      boolean(false)
    )(
      ['1', '1', 'given primitive'],
      ['2', '2', 'given primitive'],
      ['1 >= 2', 'false', 'real greater than equals'],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true for two unordered reals', () => {
    expectWriterTreeNode(
      greaterThanEquals(real(2), real(1)),
      boolean(true)
    )(
      ['2', '2', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['2 >= 1', 'true', 'real greater than equals'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns true for two equal inputs', () => {
    expectWriterTreeNode(
      greaterThanEquals(real(1), real(1)),
      boolean(true)
    )(
      ['1', '1', 'given primitive'],
      ['1', '1', 'given primitive'],
      ['1 >= 1', 'true', 'real greater than equals'],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns false for two complexes ordered by length', () => {
    expectWriterTreeNode(
      greaterThanEquals(complex([1, 1]), complex([5, 5])),
      boolean(false)
    )(
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [
        `1+1${Unicode.i} >= 5+5${Unicode.i}`,
        'false',
        'complex greater than equals'
      ],
      ['false', 'false', 'given primitive']
    )
  })

  it('returns true for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      greaterThanEquals(complex([5, 5]), complex([1, 1])),
      boolean(true)
    )(
      [`5+5${Unicode.i}`, `5+5${Unicode.i}`, 'given primitive'],
      [`1+1${Unicode.i}`, `1+1${Unicode.i}`, 'given primitive'],
      [
        `5+5${Unicode.i} >= 1+1${Unicode.i}`,
        'true',
        'complex greater than equals'
      ],
      ['true', 'true', 'given primitive']
    )
  })

  it('returns a GreaterThanEquals for variable input', () => {
    expectWriterTreeNode(
      greaterThanEquals(variable('x'), variable('y')),
      $greaterThanEquals(unit(variable('x').value), unit(variable('y').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['y', 'y', 'given variable'],
      ['x >= y', '(x>=y)', 'greater than equals']
    )
  })
})
