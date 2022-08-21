import { $kind } from '../utility/ASTNode'
import { real } from './real'
import { boolean } from './boolean'
import { complex } from './complex'

describe('real', () => {
  it('returns a Writer<Real> for a number input', () => {
    expect(real(5)).toEqual({
      value: {[$kind]: 'Real', value: 5},
      log: []
    })
  })

  it('returns a Writer<Real> for a real input', () => {
    expect(real(real(5))).toEqual({
      value: {[$kind]: 'Real', value: 5},
      log: [{input: real(5).value, action: ''}]
    })
  })

  it('returns a Writer<Real> for a complex input', () => {
    expect(real(complex([1, 2]))).toEqual({
      value: {[$kind]: 'Real', value: 1},
      log: [{input: complex([1, 2]).value, action: 'cast to real'}]
    })
  })

  it('returns a Writer<Real> for a boolean input', () => {
    expect(real(boolean(true))).toEqual({
      value: {[$kind]: 'Real', value: 1},
      log: [{input: boolean(true).value, action: 'cast to real'}]
    })
  })
})
