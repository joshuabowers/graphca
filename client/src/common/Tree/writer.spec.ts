import { $kind, real, complex, boolean, nil, variable, absolute, add } from './writer'

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
      log: [{input: complex([1, 2]).value, action: ''}]
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
      log: [{input: boolean(false).value, action: ''}]
    })
  })
})

describe('absolute', () => {
  it('returns a Writer<Real> for a real input', () => {
    expect(absolute(real(-5))).toEqual({
      value: {[$kind]: 'Real', value: 5},
      log: [{input: real(-5).value, action: 'absolute value'}]
    })
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expect(absolute(complex([1, 2]))).toEqual({
      value: {[$kind]: 'Complex', a: 2.23606797749979, b: 0},
      log: [{input: complex([1,2]).value, action: 'absolute value'}]
    })
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expect(absolute(boolean(true))).toEqual({
      value: {[$kind]: 'Boolean', value: true},
      log: [{input: boolean(true).value, action: 'absolute value'}]
    })
  })

  it('returns a Writer<Absolute> for variable input', () => {
    expect(absolute(variable('x'))).toEqual({
      value: {[$kind]: 'Absolute', expression: {
        [$kind]: 'Variable', name: 'x', value: nil
      }},
      log: [{input: variable('x').value, action: 'absolute value'}]
    })
  })
})

describe('add', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expect(add(real(1), real(2))).toEqual({
      value: {[$kind]: 'Real', value: 3},
      log: [{input: [real(1).value, real(2).value], action: 'real addition'}]
    })
  })

  it('returns a Writer<Complex> for two complex inputs', () => {
    expect(add(complex([1, 2]), complex([3, 4]))).toEqual({
      value: {[$kind]: 'Complex', a: 4, b: 6},
      log: [{
        input: [complex([1, 2]).value, complex([3, 4]).value],
        action: 'complex addition'
      }]
    })
  })

  it('returns a Writer<Boolean> for two boolean inputs', () => {
    expect(add(boolean(true), boolean(false))).toEqual({
      value: {[$kind]: 'Boolean', value: true},
      log: [{
        input: [boolean(true).value, boolean(false).value], 
        action: 'boolean addition'
      }]
    })
  })

  it('returns a Writer<Addition> for variable input', () => {
    expect(add(variable('x'), variable('y'))).toEqual({
      value: {[$kind]: 'Addition', left: variable('x').value, right: variable('y').value},
      log: [{
        input: [variable('x').value, variable('y').value],
        action: ''
      }]
    })
  })

  it('returns a complex for a [real, complex] pair', () => {
    expect(add(real(5), complex([0, 5]))).toEqual({
      value: {[$kind]: 'Complex', a: 5, b: 5},
      log: [
        {
          input: real(5).value,
          action: 'cast to complex'
        },
        {
          input: [complex([5, 0]).value, complex([0, 5]).value],
          action: 'complex addition'
        }
      ]
    })
  })

  it('returns a real for a [real, boolean] pair', () => {
    expect(add(real(9), boolean(true))).toEqual({
      value: {[$kind]: 'Real', value: 10},
      log: [
        {
          input: boolean(true).value,
          action: 'cast to real'
        },
        {
          input: [real(9).value, real(1).value],
          action: 'real addition'
        }
      ]
    })
  })
})
