import { real, complex, boolean, nil, nan } from '../primitives'
import { variable } from '../variable'
import { abs } from '../functions/absolute'
import { sin } from '../functions/trigonometric'
import { add, multiply } from '../arithmetic'
import { permute, combine } from '../functions/combinatorics'
import { deepEquals } from './deepEquals'

describe('deepEquals', () => {
  it('returns true for equivalent real inputs', () => {
    expect(deepEquals(real(5), real(5))).toBeTruthy()
  })

  it('returns false for inequivalent real inputs', () => {
    expect(deepEquals(real(0), real(5))).toBeFalsy()
  })

  it('returns true for equivalent complex inputs', () => {
    expect(deepEquals(complex(5, 5), complex(5, 5))).toBeTruthy()
  })

  it('returns false for inequivalent complex inputs', () => {
    expect(deepEquals(complex(0, 0), complex(5, 5))).toBeFalsy()
  })

  it('returns true for equivalent booleans', () => {
    expect(deepEquals(boolean(true), boolean(true))).toBeTruthy()
  })

  it('returns false for inequivalent booleans', () => {
    expect(deepEquals(boolean(true), boolean(false))).toBeFalsy()
  })

  it('returns true for equivalent nil inputs', () => {
    expect(deepEquals(nil, nil)).toBeTruthy()
  })

  it('returns false for equivalent NaN inputs', () => {
    expect(deepEquals(nan, nan)).toBeFalsy()
  })

  it('returns true for equivalent variables', () => {
    expect(deepEquals(variable('x'), variable('x'))).toBeTruthy()
  })

  it('returns false for inequivalent variables', () => {
    expect(deepEquals(variable('x'), variable('y'))).toBeFalsy()
  })

  it('returns true for equivalent unary functions', () => {
    expect(deepEquals(abs(variable('x')), abs(variable('x')))).toBeTruthy()
  })

  it('returns false for equivalent unary functions with inequivalent children', () => {
    expect(deepEquals(abs(variable('x')), abs(variable('y')))).toBeFalsy()
  })

  it('returns false for inequivalent unary functions', () => {
    expect(deepEquals(abs(variable('x')), sin(variable('x')))).toBeFalsy()
  })

  it('returns true for equivalent binary functions', () => {
    expect(deepEquals(
      combine(variable('x'), real(5)),
      combine(variable('x'), real(5))
    )).toBeTruthy()
  })

  it('returns false for equivalent binary functions with inequivalent children', () =>{
    expect(deepEquals(
      combine(variable('x'), real(5)),
      combine(variable('y'), real(10))
    )).toBeFalsy()
  })

  it('returns false for inequivalent binary functions', () => {
    expect(deepEquals(
      combine(variable('x'), variable('y')),
      permute(variable('x'), variable('y'))
    )).toBeFalsy()
  })

  it('returns true for equivalent multiary functions', () => {
    expect(deepEquals(
      add(variable('x'), variable('y'), variable('z')),
      add(variable('x'), variable('y'), variable('z'))
    ))
  })

  it('returns false for equivalent multiary functions with inequivalent children', () => {
    expect(deepEquals(
      add(variable('x'), real(5)),
      add(variable('y'), real(10))
    ))
  })

  it('returns false for inequivalent multiary functions', () => {
    expect(deepEquals(
      add(variable('x'), variable('y')),
      multiply(variable('x'), variable('y'))
    )).toBeFalsy()
  })
})
