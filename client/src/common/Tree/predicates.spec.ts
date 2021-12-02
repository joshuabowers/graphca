import { is, areEqual, identity, leftChild, rightChild } from './predicates'
import { Base } from './Expression'
import { Real, real } from './real'
import { Variable, variable } from './variable'
import { Exponentiation, square, sqrt } from './exponentiation'
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

describe(areEqual, () => {
  it('is true for directly equal things', () => {
    expect(areEqual(Real, Real)(identity, identity)(real(0), real(0))).toBeTruthy()
  })

  it('is false for directly unequal things', () => {
    expect(areEqual(Real, Real)(identity, identity)(real(0), variable('x'))).toBeFalsy()
  })

  it('is true for slightly nested equal things', () => {
    const a = variable('x'), b = square(variable('x'))
    expect(areEqual(Variable, Exponentiation)(identity, leftChild)(a, b)).toBeTruthy()
  })

  it('is false for slightly nested unequal things', () => {
    const a = variable('x'), b = square(variable('x'))
    expect(areEqual(Variable, Exponentiation)(identity, rightChild)(a, b)).toBeFalsy()
  })

  it('is true for deeply nested equal things', () => {
    const a = square(variable('x')), b = sqrt(variable('x'))
    expect(areEqual(Exponentiation, Exponentiation)(leftChild, leftChild)(a, b)).toBeTruthy()
  })

  it('is false for deeply nested unequal things', () => {
    const a = square(variable('x')), b = sqrt(variable('x'))
    expect(areEqual(Exponentiation, Exponentiation)(rightChild, rightChild)(a, b)).toBeFalsy()
  })
})
