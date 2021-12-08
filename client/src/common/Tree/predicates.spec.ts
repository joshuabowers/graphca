import { areEqual, identity, leftChild, rightChild } from './predicates'
import { Real, real } from './real'
import { Variable, variable } from './variable'
import { Exponentiation, square, sqrt } from './exponentiation'

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
