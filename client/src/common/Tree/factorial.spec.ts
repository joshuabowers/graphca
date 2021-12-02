import { real } from './real'
import { complex } from './complex'
import { variable } from './variable';
import { Factorial, factorial } from "./factorial";

describe('factorial', () => {
  it('returns 1 for an input of 0', () => {
    expect(factorial(real(0))).toEqual(real(1))
  })

  it('returns the factorial for positive integers', () => {
    expect(factorial(real(5))).toEqual(real(120))
  })

  it('returns complex 1 for an input of complex 0', () => {
    expect(factorial(complex(0, 0))).toEqual(complex(1, 0))
  })

  it('returns the factorial for a integer complex', () => {
    expect(factorial(complex(5, 0))).toEqual(complex(120, 0))
  })

  it('returns NaN for non-positive integer reals', () => {
    expect(factorial(real(-5))).toEqual(real(NaN))
  })

  it('returns NaN for non-integer reals', () => {
    expect(factorial(real(5.5))).toEqual(real(NaN))
  })

  it('returns NaN for non-integer complex numbers', () => {
    expect(factorial(complex(1, 1))).toEqual(complex(NaN, NaN))
  })

  it('returns a Factorial node for unbound variables', () => {
    expect(factorial(variable('x'))).toEqual(new Factorial(variable('x')))
  })
})
