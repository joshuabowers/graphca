import { unit } from '../monads/writer'
import { 
  expectWriterTreeNode,
  realOps, complexOps, booleanOps, variableOps,
  equalsOps, notEqualsOps, lessThanOps, 
  greaterThanOps, lessThanEqualsOps, greaterThanEqualsOps
} from '../utility/expectations';
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
    expectWriterTreeNode(
      equals(real(1), real(1)),
      boolean(true)
    )(
      ...equalsOps(
        'real equality',
        realOps('1'),
        realOps('1'),
        booleanOps('true')
      )
    )
  })

  it('returns true for two equal complexes', () => {
    expectWriterTreeNode(
      equals(complex([1,1]), complex([1,1])),
      boolean(true)
    )(
      ...equalsOps(
        'complex equality',
        complexOps('1', '1'),
        complexOps('1', '1'),
        booleanOps('true')
      )
    )
  })

  it('returns true for two equal booleans', () => {
    expectWriterTreeNode(
      equals(boolean(false), boolean(false)),
      boolean(true)
    )(
      ...equalsOps(
        'boolean equality',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('true')
      )
    )
  })

  it('returns false for unequal things', () => {
    expectWriterTreeNode(
      equals(real(1), real(2)),
      boolean(false)
    )(
      ...equalsOps(
        'real equality',
        realOps('1'),
        realOps('2'),
        booleanOps('false')
      )
    )
  })

  it('returns an Equals for variable input', () => {
    expectWriterTreeNode(
      equals(variable('x'), variable('y')),
      $equals(variable('x'), variable('y'))[0]
    )(
      ...equalsOps(
        'created equality',
        variableOps('x'),
        variableOps('y'),
        []
      )
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
      ...notEqualsOps(
        'real inequality',
        realOps('1'),
        realOps('1'),
        booleanOps('false')
      )
    )
  })

  it('returns false for two equal complexes', () => {
    expectWriterTreeNode(
      notEquals(complex([1,1]), complex([1,1])),
      boolean(false)
    )(
      ...notEqualsOps(
        'complex inequality',
        complexOps('1', '1'),
        complexOps('1', '1'),
        booleanOps('false')
      )
    )
  })

  it('returns false for two equal booleans', () => {
    expectWriterTreeNode(
      notEquals(boolean(false), boolean(false)),
      boolean(false)
    )(
      ...notEqualsOps(
        'boolean inequality',
        booleanOps('false'),
        booleanOps('false'),
        booleanOps('false')
      )
    )
  })

  it('returns true for unequal things', () => {
    expectWriterTreeNode(
      notEquals(real(1), real(2)),
      boolean(true)
    )(
      ...notEqualsOps(
        'real inequality',
        realOps('1'),
        realOps('2'),
        booleanOps('true')
      )
    )
  })

  it('returns a NotEquals for variable input', () => {
    expectWriterTreeNode(
      notEquals(variable('x'), variable('y')),
      $notEquals(variable('x'), variable('y'))[0]
    )(
      ...notEqualsOps(
        'created inequality',
        variableOps('x'),
        variableOps('y'),
        []
      )
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
      ...lessThanOps(
        'real less than',
        realOps('1'),
        realOps('2'),
        booleanOps('true')
      )
    )
  })

  it('returns false for two unordered reals', () => {
    expectWriterTreeNode(
      lessThan(real(2), real(1)),
      boolean(false)
    )(
      ...lessThanOps(
        'real less than',
        realOps('2'),
        realOps('1'),
        booleanOps('false')
      )
    )
  })

  it('returns false for two equal inputs', () => {
    expectWriterTreeNode(
      lessThan(real(1), real(1)),
      boolean(false)
    )(
      ...lessThanOps(
        'real less than',
        realOps('1'),
        realOps('1'),
        booleanOps('false')
      )
    )
  })

  it('returns true for two complexes ordered by length', () => {
    expectWriterTreeNode(
      lessThan(complex([1, 1]), complex([5, 5])),
      boolean(true)
    )(
      ...lessThanOps(
        'complex less than',
        complexOps('1', '1'),
        complexOps('5', '5'),
        booleanOps('true')
      )
    )
  })

  it('returns false for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      lessThan(complex([5, 5]), complex([1, 1])),
      boolean(false)
    )(
      ...lessThanOps(
        'complex less than',
        complexOps('5', '5'),
        complexOps('1', '1'),
        booleanOps('false')
      )
    )
  })

  it('returns a LessThan for variable input', () => {
    expectWriterTreeNode(
      lessThan(variable('x'), variable('y')),
      $lessThan(variable('x'), variable('y'))[0]
    )(
      ...lessThanOps(
        'created less than',
        variableOps('x'),
        variableOps('y'),
        []
      )
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
      ...greaterThanOps(
        'real greater than',
        realOps('1'),
        realOps('2'),
        booleanOps('false')
      )
    )
  })

  it('returns true for two unordered reals', () => {
    expectWriterTreeNode(
      greaterThan(real(2), real(1)),
      boolean(true)
    )(
      ...greaterThanOps(
        'real greater than',
        realOps('2'),
        realOps('1'),
        booleanOps('true')
      )
    )
  })

  it('returns false for two equal inputs', () => {
    expectWriterTreeNode(
      greaterThan(real(1), real(1)),
      boolean(false)
    )(
      ...greaterThanOps(
        'real greater than',
        realOps('1'),
        realOps('1'),
        booleanOps('false')
      )
    )
  })

  it('returns false for two complexes ordered by length', () => {
    expectWriterTreeNode(
      greaterThan(complex([1, 1]), complex([5, 5])),
      boolean(false)
    )(
      ...greaterThanOps(
        'complex greater than',
        complexOps('1', '1'),
        complexOps('5', '5'),
        booleanOps('false')
      )
    )
  })

  it('returns true for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      greaterThan(complex([5, 5]), complex([1, 1])),
      boolean(true)
    )(
      ...greaterThanOps(
        'complex greater than',
        complexOps('5', '5'),
        complexOps('1', '1'),
        booleanOps('true')
      )
    )
  })

  it('returns a GreaterThan for variable input', () => {
    expectWriterTreeNode(
      greaterThan(variable('x'), variable('y')),
      $greaterThan(variable('x'), variable('y'))[0]
    )(
      ...greaterThanOps(
        'created greater than',
        variableOps('x'),
        variableOps('y'),
        []
      )
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
      ...lessThanEqualsOps(
        'real less than equals',
        realOps('1'),
        realOps('2'),
        booleanOps('true')
      )
    )
  })

  it('returns false for two unordered reals', () => {
    expectWriterTreeNode(
      lessThanEquals(real(2), real(1)),
      boolean(false)
    )(
      ...lessThanEqualsOps(
        'real less than equals',
        realOps('2'),
        realOps('1'),
        booleanOps('false')
      )
    )
  })

  it('returns true for two equal inputs', () => {
    expectWriterTreeNode(
      lessThanEquals(real(1), real(1)),
      boolean(true)
    )(
      ...lessThanEqualsOps(
        'real less than equals',
        realOps('1'),
        realOps('1'),
        booleanOps('true')
      )
    )
  })

  it('returns true for two complexes ordered by length', () => {
    expectWriterTreeNode(
      lessThanEquals(complex([1, 1]), complex([5, 5])),
      boolean(true)
    )(
      ...lessThanEqualsOps(
        'complex less than equals',
        complexOps('1', '1'),
        complexOps('5', '5'),
        booleanOps('true')
      )
    )
  })

  it('returns false for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      lessThanEquals(complex([5, 5]), complex([1, 1])),
      boolean(false)
    )(
      ...lessThanEqualsOps(
        'complex less than equals',
        complexOps('5', '5'),
        complexOps('1', '1'),
        booleanOps('false')
      )
    )
  })

  it('returns a LessThanEquals for variable input', () => {
    expectWriterTreeNode(
      lessThanEquals(variable('x'), variable('y')),
      $lessThanEquals(variable('x'), variable('y'))[0]
    )(
      ...lessThanEqualsOps(
        'created less than equals',
        variableOps('x'),
        variableOps('y'),
        []
      )
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
      ...greaterThanEqualsOps(
        'real greater than equals',
        realOps('1'),
        realOps('2'),
        booleanOps('false')
      )
    )
  })

  it('returns true for two unordered reals', () => {
    expectWriterTreeNode(
      greaterThanEquals(real(2), real(1)),
      boolean(true)
    )(
      ...greaterThanEqualsOps(
        'real greater than equals',
        realOps('2'),
        realOps('1'),
        booleanOps('true')
      )
    )
  })

  it('returns true for two equal inputs', () => {
    expectWriterTreeNode(
      greaterThanEquals(real(1), real(1)),
      boolean(true)
    )(
      ...greaterThanEqualsOps(
        'real greater than equals',
        realOps('1'),
        realOps('1'),
        booleanOps('true')
      )
    )
  })

  it('returns false for two complexes ordered by length', () => {
    expectWriterTreeNode(
      greaterThanEquals(complex([1, 1]), complex([5, 5])),
      boolean(false)
    )(
      ...greaterThanEqualsOps(
        'complex greater than equals',
        complexOps('1', '1'),
        complexOps('5', '5'),
        booleanOps('false')
      )
    )
  })

  it('returns true for two complexes not ordered by length', () => {
    expectWriterTreeNode(
      greaterThanEquals(complex([5, 5]), complex([1, 1])),
      boolean(true)
    )(
      ...greaterThanEqualsOps(
        'complex greater than equals',
        complexOps('5', '5'),
        complexOps('1', '1'),
        booleanOps('true')
      )
    )
  })

  it('returns a GreaterThanEquals for variable input', () => {
    expectWriterTreeNode(
      greaterThanEquals(variable('x'), variable('y')),
      $greaterThanEquals(variable('x'), variable('y'))[0]
    )(
      ...greaterThanEqualsOps(
        'created greater than equals',
        variableOps('x'),
        variableOps('y'),
        []
      )
    )
  })
})
