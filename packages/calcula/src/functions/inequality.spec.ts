import { unit } from '../monads/writer'
import { expectToEqualWithSnapshot } from '../utility/expectations';
import { Clades, Genera, Species } from '../utility/tree';
import { real, complex, boolean } from '../primitives';
import { variable } from '../variable'
import {
  equals, notEquals, lessThan, greaterThan, lessThanEquals, greaterThanEquals, 
  $equals, $notEquals, $lessThan, $greaterThan, $lessThanEquals, $greaterThanEquals
} from "./inequality";

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
    expectToEqualWithSnapshot(
      equals(real(1), real(1)),
      boolean(true)
    )
  })

  it('returns true for two equal complexes', () => {
    expectToEqualWithSnapshot(
      equals(complex(1,1), complex(1,1)),
      boolean(true)
    )
  })

  it('returns true for two equal booleans', () => {
    expectToEqualWithSnapshot(
      equals(boolean(false), boolean(false)),
      boolean(true)
    )
  })

  it('returns false for unequal things', () => {
    expectToEqualWithSnapshot(
      equals(real(1), real(2)),
      boolean(false)
    )
  })

  it('returns an Equals for variable input', () => {
    expectToEqualWithSnapshot(
      equals(variable('x'), variable('y')),
      $equals(variable('x'), variable('y'))[0]
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
    expectToEqualWithSnapshot(
      notEquals(real(1), real(1)),
      boolean(false)
    )
  })

  it('returns false for two equal complexes', () => {
    expectToEqualWithSnapshot(
      notEquals(complex(1,1), complex(1,1)),
      boolean(false)
    )
  })

  it('returns false for two equal booleans', () => {
    expectToEqualWithSnapshot(
      notEquals(boolean(false), boolean(false)),
      boolean(false)
    )
  })

  it('returns true for unequal things', () => {
    expectToEqualWithSnapshot(
      notEquals(real(1), real(2)),
      boolean(true)
    )
  })

  it('returns a NotEquals for variable input', () => {
    expectToEqualWithSnapshot(
      notEquals(variable('x'), variable('y')),
      $notEquals(variable('x'), variable('y'))[0]
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
    expectToEqualWithSnapshot(
      lessThan(real(1), real(2)),
      boolean(true)
    )
  })

  it('returns false for two unordered reals', () => {
    expectToEqualWithSnapshot(
      lessThan(real(2), real(1)),
      boolean(false)
    )
  })

  it('returns false for two equal inputs', () => {
    expectToEqualWithSnapshot(
      lessThan(real(1), real(1)),
      boolean(false)
    )
  })

  it('returns true for two complexes ordered by length', () => {
    expectToEqualWithSnapshot(
      lessThan(complex(1, 1), complex(5, 5)),
      boolean(true)
    )
  })

  it('returns false for two complexes not ordered by length', () => {
    expectToEqualWithSnapshot(
      lessThan(complex(5, 5), complex(1, 1)),
      boolean(false)
    )
  })

  it('returns a LessThan for variable input', () => {
    expectToEqualWithSnapshot(
      lessThan(variable('x'), variable('y')),
      $lessThan(variable('x'), variable('y'))[0]
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
    expectToEqualWithSnapshot(
      greaterThan(real(1), real(2)),
      boolean(false)
    )
  })

  it('returns true for two unordered reals', () => {
    expectToEqualWithSnapshot(
      greaterThan(real(2), real(1)),
      boolean(true)
    )
  })

  it('returns false for two equal inputs', () => {
    expectToEqualWithSnapshot(
      greaterThan(real(1), real(1)),
      boolean(false)
    )
  })

  it('returns false for two complexes ordered by length', () => {
    expectToEqualWithSnapshot(
      greaterThan(complex(1, 1), complex(5, 5)),
      boolean(false)
    )
  })

  it('returns true for two complexes not ordered by length', () => {
    expectToEqualWithSnapshot(
      greaterThan(complex(5, 5), complex(1, 1)),
      boolean(true)
    )
  })

  it('returns a GreaterThan for variable input', () => {
    expectToEqualWithSnapshot(
      greaterThan(variable('x'), variable('y')),
      $greaterThan(variable('x'), variable('y'))[0]
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
    expectToEqualWithSnapshot(
      lessThanEquals(real(1), real(2)),
      boolean(true)
    )
  })

  it('returns false for two unordered reals', () => {
    expectToEqualWithSnapshot(
      lessThanEquals(real(2), real(1)),
      boolean(false)
    )
  })

  it('returns true for two equal inputs', () => {
    expectToEqualWithSnapshot(
      lessThanEquals(real(1), real(1)),
      boolean(true)
    )
  })

  it('returns true for two complexes ordered by length', () => {
    expectToEqualWithSnapshot(
      lessThanEquals(complex(1, 1), complex(5, 5)),
      boolean(true)
    )
  })

  it('returns false for two complexes not ordered by length', () => {
    expectToEqualWithSnapshot(
      lessThanEquals(complex(5, 5), complex(1, 1)),
      boolean(false)
    )
  })

  it('returns a LessThanEquals for variable input', () => {
    expectToEqualWithSnapshot(
      lessThanEquals(variable('x'), variable('y')),
      $lessThanEquals(variable('x'), variable('y'))[0]
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
    expectToEqualWithSnapshot(
      greaterThanEquals(real(1), real(2)),
      boolean(false)
    )
  })

  it('returns true for two unordered reals', () => {
    expectToEqualWithSnapshot(
      greaterThanEquals(real(2), real(1)),
      boolean(true)
    )
  })

  it('returns true for two equal inputs', () => {
    expectToEqualWithSnapshot(
      greaterThanEquals(real(1), real(1)),
      boolean(true)
    )
  })

  it('returns false for two complexes ordered by length', () => {
    expectToEqualWithSnapshot(
      greaterThanEquals(complex(1, 1), complex(5, 5)),
      boolean(false)
    )
  })

  it('returns true for two complexes not ordered by length', () => {
    expectToEqualWithSnapshot(
      greaterThanEquals(complex(5, 5), complex(1, 1)),
      boolean(true)
    )
  })

  it('returns a GreaterThanEquals for variable input', () => {
    expectToEqualWithSnapshot(
      greaterThanEquals(variable('x'), variable('y')),
      $greaterThanEquals(variable('x'), variable('y'))[0]
    )
  })
})
