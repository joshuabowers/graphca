import { is } from './is'
import { Base } from './Expression'
import { Real, real } from './real'
import { Variable, variable } from './variable'
import { Exponentiation, square } from './exponentiation'
import { Trigonometric, cos } from './trigonometric'

describe(is, () => {
  it('validates a subclass is a superclass', () => {
    expect(is(Base)(real(0))).toBeTruthy()
  })

  it('validates a real is a Real', () => {
    expect(is(Real)(real(0))).toBeTruthy()
  })

  it('validates a variable is a Variable', () => {
    expect(is(Variable)(variable('x'))).toBeTruthy()
  })

  it('validates an exponentiation is an Exponentiation', () => {
    expect(is(Exponentiation)(square(variable('x')))).toBeTruthy()
  })

  it('validates a cosine is a Trigonometric', () => {
    expect(is(Trigonometric)(cos(variable('x')))).toBeTruthy()
  })

  it('invalidates unlike things', () => {
    expect(is(Exponentiation)(real(0))).toBeFalsy()
  })

  it('validates a masquerading object', () => {
    const v: unknown = real(0)
    expect(is(Base)(v)).toBeTruthy()
  })
})