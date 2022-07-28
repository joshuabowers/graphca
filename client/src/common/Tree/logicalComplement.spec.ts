import { real } from './real'
import { complex } from './complex'
import { bool } from './boolean'
import { variable } from './variable'
import { not, LogicalComplement } from './logicalComplement'

describe('not', () => {
  it('yields false for non-zero real inputs', () => {
    expect(not(real(5))).toEqual(bool(false))
  })

  it('yields true for a real value of zero', () => {
    expect(not(real(0))).toEqual(bool(true))
  })

  it('yields false for non-zero complex inputs', () => {
    expect(not(complex(1, 0))).toEqual(bool(false))
  })

  it('yields true for complex 0', () => {
    expect(not(complex(0, 0))).toEqual(bool(true))
  })

  it('yields false for a true input', () => {
    expect(not(bool(true))).toEqual(bool(false))
  })

  it('yields true for a false input', () => {
    expect(not(bool(false))).toEqual(bool(true))
  })

  it('yields a logical complement for variable input', () => {
    expect(not(variable('x'))).toEqual(new LogicalComplement(variable('x')))
  })

  it('rewrites double negations as the inner expression', () => {
    expect(not(not(variable('x')))).toEqual(variable('x'))
  })
})
