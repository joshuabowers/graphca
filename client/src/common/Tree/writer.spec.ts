import { $kind, real, complex, boolean } from './writer'

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
      log: []
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

describe('complex', () => {
  it('returns a Writer<Complex> for a number pair input', () => {
    expect(complex([1, 2])).toEqual({
      value: {[$kind]: 'Complex', a: 1, b: 2},
      log: []
    })
  })

  it('returns a Writer<Complex> for a real input', () => {
    expect(complex(real(5))).toEqual({
      value: {[$kind]: 'Complex', a: 5, b: 0},
      log: [{input: real(5).value, action: 'cast to complex'}]
    })
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expect(complex(complex([1, 2]))).toEqual({
      value: {[$kind]: 'Complex', a: 1, b: 2},
      log: []
    })
  })

  it('returns a Writer<Complex> for a boolean input', () => {
    expect(complex(boolean(true))).toEqual({
      value: {[$kind]: 'Complex', a: 1, b: 0},
      log: [{input: boolean(true).value, action: 'cast to complex'}]
    })
  })
})

describe('boolean', () => {
  it('returns a Writer<Boolean> for a system boolean input', () => {
    expect(boolean(true)).toEqual({
      value: {[$kind]: 'Boolean', value: true},
      log: []
    })
  })

  it('returns a Writer<Boolean> for a real input', () => {
    expect(boolean(real(5))).toEqual({
      value: {[$kind]: 'Boolean', value: true},
      log: [{input: real(5).value, action: 'cast to boolean'}]
    })
  })

  it('returns a Writer<Boolean> for a complex input', () => {
    expect(boolean(complex([1, 2]))).toEqual({
      value: {[$kind]: 'Boolean', value: true},
      log: [{input: complex([1, 2]).value, action: 'cast to boolean'}]
    })
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expect(boolean(boolean(false))).toEqual({
      value: {[$kind]: 'Boolean', value: false},
      log: []
    })
  })
})
