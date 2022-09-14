import { expectWriter } from '../utility/expectations';
import { Clades, Genera, Species } from '../utility/tree';
import { real, complex, boolean } from '../primitives';
import { variable } from '../variable'
import {
  Equality, 
  equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals, 
  $notEquals, $lessThan, $greaterThan, $lessThanEquals, $greaterThanEquals
} from "./inequality";

describe('equals', () => {
  it('returns true for two equal reals', () => {
    expectWriter(equals(real(1), real(1)))(
      boolean(true).value,
      [[real(1).value, real(1).value], 'real equality']
    )
  })

  it('returns true for two equal complexes', () => {
    expectWriter(equals(complex([1,1]), complex([1,1])))(
      boolean(true).value,
      [[complex([1,1]).value, complex([1,1]).value], 'complex equality']
    )
  })

  it('returns true for two equal booleans', () => {
    expectWriter(equals(boolean(false), boolean(false)))(
      boolean(true).value,
      [[boolean(false).value, boolean(false).value], 'boolean equality']
    )
  })

  it('returns false for unequal things', () => {
    expectWriter(equals(real(1), real(2)))(
      boolean(false).value,
      [[real(1).value, real(2).value], 'real equality']
    )
  })

  it('returns an Equals for variable input', () => {
    expectWriter(equals(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.inequalities, species: Species.equals,
        left: variable('x'), right: variable('y')
      } as Equality,
      [[variable('x').value, variable('y').value], 'equality']
    )
  })
})

describe('notEquals', () => {
  it('returns false for two equal reals', () => {
    expect(notEquals(real(1), real(1)).value).toEqual(boolean(false).value)
  })

  it('returns false for two equal complexes', () => {
    expect(notEquals(complex([1,1]), complex([1,1])).value).toEqual(boolean(false).value)
  })

  it('returns false for two equal booleans', () => {
    expect(notEquals(boolean(false), boolean(false)).value).toEqual(boolean(false).value)
  })

  it('returns true for unequal things', () => {
    expect(notEquals(real(1), real(2)).value).toEqual(boolean(true).value)
  })

  it('returns a NotEquals for variable input', () => {
    expect(notEquals(variable('x'), real(1)).value).toEqual(
      $notEquals(variable('x'), real(1))[0]
    )
  })
})

describe('lessThan', () => {
  it('returns true for two ordered reals', () => {
    expect(lessThan(real(1), real(2)).value).toEqual(boolean(true).value)
  })

  it('returns false for two unordered reals', () => {
    expect(lessThan(real(2), real(1)).value).toEqual(boolean(false).value)
  })

  it('returns false for two equal inputs', () => {
    expect(lessThan(real(1), real(1)).value).toEqual(boolean(false).value)
  })

  it('returns true for two complexes ordered by length', () => {
    expect(lessThan(complex([1, 1]), complex([5, 5])).value).toEqual(boolean(true).value)
  })

  it('returns false for two complexes not ordered by length', () => {
    expect(lessThan(complex([5, 5]), complex([1, 1])).value).toEqual(boolean(false).value)
  })

  it('returns a LessThan for variable input', () => {
    expect(lessThan(variable('x'), variable('y')).value).toEqual(
      $lessThan(variable('x'), variable('y'))[0]
    )
  })
})

describe('greaterThan', () => {
  it('returns false for two ordered reals', () => {
    expect(greaterThan(real(1), real(2)).value).toEqual(boolean(false).value)
  })

  it('returns true for two unordered reals', () => {
    expect(greaterThan(real(2), real(1)).value).toEqual(boolean(true).value)
  })

  it('returns false for two equal inputs', () => {
    expect(greaterThan(real(1), real(1)).value).toEqual(boolean(false).value)
  })

  it('returns false for two complexes ordered by length', () => {
    expect(greaterThan(complex([1, 1]), complex([5, 5])).value).toEqual(boolean(false).value)
  })

  it('returns true for two complexes not ordered by length', () => {
    expect(greaterThan(complex([5, 5]), complex([1, 1])).value).toEqual(boolean(true).value)
  })

  it('returns a GreaterThan for variable input', () => {
    expect(greaterThan(variable('x'), variable('y')).value).toEqual(
      $greaterThan(variable('x'), variable('y'))[0]
    )
  })
})

describe('lessThanEquals', () => {
  it('returns true for two ordered reals', () => {
    expect(lessThanEquals(real(1), real(2)).value).toEqual(boolean(true).value)
  })

  it('returns false for two unordered reals', () => {
    expect(lessThanEquals(real(2), real(1)).value).toEqual(boolean(false).value)
  })

  it('returns true for two equal inputs', () => {
    expect(lessThanEquals(real(1), real(1)).value).toEqual(boolean(true).value)
  })

  it('returns true for two complexes ordered by length', () => {
    expect(lessThanEquals(complex([1, 1]), complex([5, 5])).value).toEqual(boolean(true).value)
  })

  it('returns false for two complexes not ordered by length', () => {
    expect(lessThanEquals(complex([5, 5]), complex([1, 1])).value).toEqual(boolean(false).value)
  })

  it('returns a LessThanEquals for variable input', () => {
    expect(lessThanEquals(variable('x'), variable('y')).value).toEqual(
      $lessThanEquals(variable('x'), variable('y'))[0]
    )
  })
})

describe('greaterThanEquals', () => {
  it('returns false for two ordered reals', () => {
    expect(greaterThanEquals(real(1), real(2)).value).toEqual(boolean(false).value)
  })

  it('returns true for two unordered reals', () => {
    expect(greaterThanEquals(real(2), real(1)).value).toEqual(boolean(true).value)
  })

  it('returns true for two equal inputs', () => {
    expect(greaterThanEquals(real(1), real(1)).value).toEqual(boolean(true).value)
  })

  it('returns false for two complexes ordered by length', () => {
    expect(greaterThanEquals(complex([1, 1]), complex([5, 5])).value).toEqual(boolean(false).value)
  })

  it('returns true for two complexes not ordered by length', () => {
    expect(greaterThanEquals(complex([5, 5]), complex([1, 1])).value).toEqual(boolean(true).value)
  })

  it('returns a GreaterThanEquals for variable input', () => {
    expect(greaterThanEquals(variable('x'), variable('y')).value).toEqual(
      $greaterThanEquals(variable('x'), variable('y'))[0]
    )
  })
})
