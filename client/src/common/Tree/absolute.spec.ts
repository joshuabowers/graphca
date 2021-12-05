import { real } from './real'
import { complex } from './complex'
import { variable } from "./variable";
import { AbsoluteValue, abs } from "./absolute";

describe('abs', () => {
  it('returns the absolute value of a real number', () => {
    expect(abs(real(-1))).toEqual(real(1))
  })

  it('returns the absolute value of a complex number', () => {
    expect(abs(complex(1, 1))).toEqual(complex(1.4142135623730951, 0))
  })

  it('returns an AbsoluteValue node for unbound variables', () => {
    expect(abs(variable('x'))).toEqual(new AbsoluteValue(variable('x')))
  })
})
