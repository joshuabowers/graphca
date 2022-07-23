import { real } from './real'
import { complex } from './complex'
import { bool } from './boolean'
import { variable } from './variable'
import {
  Conjunction, Disjunction,
  and, or
} from './connective'

describe('and', () => {
  it('returns true when given two true things', () => {
    expect(and(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns false if the left argument is false', () => {
    expect(and(bool(false), bool(true))).toEqual(bool(false))
  })

  it('returns false if the right argument is false', () => {
    expect(and(bool(true), bool(false))).toEqual(bool(false))
  })

  it('returns false if both arguments are false', () => {
    expect(and(bool(false), bool(false))).toEqual(bool(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(and(real(5), real(0))).toEqual(bool(false))
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expect(and(complex(5,0), complex(0,0))).toEqual(bool(false))
  })

  it('returns a Conjunction on variable input', () => {
    expect(and(variable('x'), variable('y'))).toEqual(
      new Conjunction(variable('x'), variable('y'))
    )
  })
})

describe('or', () => {
  it('returns true when given two true things', () => {
    expect(or(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns true if the left argument is true', () => {
    expect(or(bool(true), bool(false))).toEqual(bool(true))
  })

  it('returns true if the right argument is true', () => {
    expect(or(bool(false), bool(true))).toEqual(bool(true))
  })

  it('returns false if both arguments are false', () => {
    expect(or(bool(false), bool(false))).toEqual(bool(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(or(real(5), real(0))).toEqual(bool(true))
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expect(or(complex(5,0), complex(0,0))).toEqual(bool(true))
  })

  it('returns a Disjunction on variable input', () => {
    expect(or(variable('x'), variable('y'))).toEqual(
      new Disjunction(variable('x'), variable('y'))
    )
  })
})
