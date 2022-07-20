import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { bool } from './boolean'
import { 
  LessThan, GreaterThan, LessThanEquals, GreaterThanEquals,
  lessThan, greaterThan, lessThanEquals, greaterThanEquals
} from "./inequality";

describe('lessThan', () => {
  it('returns true for two ordered reals', () => {
    expect(lessThan(real(1), real(2))).toEqual(bool(true))
  })

  it('returns false for two unordered reals', () => {
    expect(lessThan(real(2), real(1))).toEqual(bool(false))
  })

  it('returns false for two equal inputs', () => {
    expect(lessThan(real(1), real(1))).toEqual(bool(false))
  })

  it('returns true for two complexes ordered by length', () => {
    expect(lessThan(complex(1, 1), complex(5, 5))).toEqual(bool(true))
  })

  it('returns false for two complexes not ordered by length', () => {
    expect(lessThan(complex(5, 5), complex(1, 1))).toEqual(bool(false))
  })

  it('returns a LessThan for variable input', () => {
    expect(lessThan(variable('x'), variable('y'))).toEqual(
      new LessThan(variable('x'), variable('y'))
    )
  })
})

describe('greaterThan', () => {
  it('returns false for two ordered reals', () => {
    expect(greaterThan(real(1), real(2))).toEqual(bool(false))
  })

  it('returns true for two unordered reals', () => {
    expect(greaterThan(real(2), real(1))).toEqual(bool(true))
  })

  it('returns false for two equal inputs', () => {
    expect(greaterThan(real(1), real(1))).toEqual(bool(false))
  })

  it('returns false for two complexes ordered by length', () => {
    expect(greaterThan(complex(1, 1), complex(5, 5))).toEqual(bool(false))
  })

  it('returns true for two complexes not ordered by length', () => {
    expect(greaterThan(complex(5, 5), complex(1, 1))).toEqual(bool(true))
  })

  it('returns a GreaterThan for variable input', () => {
    expect(greaterThan(variable('x'), variable('y'))).toEqual(
      new GreaterThan(variable('x'), variable('y'))
    )
  })
})

describe('lessThanEquals', () => {
  it('returns true for two ordered reals', () => {
    expect(lessThanEquals(real(1), real(2))).toEqual(bool(true))
  })

  it('returns false for two unordered reals', () => {
    expect(lessThanEquals(real(2), real(1))).toEqual(bool(false))
  })

  it('returns true for two equal inputs', () => {
    expect(lessThanEquals(real(1), real(1))).toEqual(bool(true))
  })

  it('returns true for two complexes ordered by length', () => {
    expect(lessThanEquals(complex(1, 1), complex(5, 5))).toEqual(bool(true))
  })

  it('returns false for two complexes not ordered by length', () => {
    expect(lessThanEquals(complex(5, 5), complex(1, 1))).toEqual(bool(false))
  })

  it('returns a LessThanEquals for variable input', () => {
    expect(lessThanEquals(variable('x'), variable('y'))).toEqual(
      new LessThanEquals(variable('x'), variable('y'))
    )
  })
})

describe('greaterThanEquals', () => {
  it('returns false for two ordered reals', () => {
    expect(greaterThanEquals(real(1), real(2))).toEqual(bool(false))
  })

  it('returns true for two unordered reals', () => {
    expect(greaterThanEquals(real(2), real(1))).toEqual(bool(true))
  })

  it('returns true for two equal inputs', () => {
    expect(greaterThanEquals(real(1), real(1))).toEqual(bool(true))
  })

  it('returns false for two complexes ordered by length', () => {
    expect(greaterThanEquals(complex(1, 1), complex(5, 5))).toEqual(bool(false))
  })

  it('returns true for two complexes not ordered by length', () => {
    expect(greaterThanEquals(complex(5, 5), complex(1, 1))).toEqual(bool(true))
  })

  it('returns a GreaterThanEquals for variable input', () => {
    expect(greaterThanEquals(variable('x'), variable('y'))).toEqual(
      new GreaterThanEquals(variable('x'), variable('y'))
    )
  })
})
