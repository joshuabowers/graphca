import { 
  $kind, real, complex, boolean, nil, nan, variable, absolute, sin, 
  add, subtract, multiply, negate, double,
  deepEquals
} from './writer'

describe('deepEquals', () => {
  it('returns true for equivalent real inputs', () => {
    expect(deepEquals(real(5), real(5))).toBeTruthy()
  })

  it('returns false for inequivalent real inputs', () => {
    expect(deepEquals(real(0), real(5))).toBeFalsy()
  })

  it('returns true for equivalent complex inputs', () => {
    expect(deepEquals(complex([5, 5]), complex([5, 5]))).toBeTruthy()
  })

  it('returns false for inequivalent complex inputs', () => {
    expect(deepEquals(complex([0, 0]), complex([5, 5]))).toBeFalsy()
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
    expect(deepEquals(absolute(variable('x')), absolute(variable('x')))).toBeTruthy()
  })

  it('returns false for equivalent unary functions with inequivalent children', () => {
    expect(deepEquals(absolute(variable('x')), absolute(variable('y')))).toBeFalsy()
  })

  it('returns false for inequivalent unary functions', () => {
    expect(deepEquals(absolute(variable('x')), sin(variable('x')))).toBeFalsy()
  })

  it('returns true for equivalent binary functions', () => {
    expect(deepEquals(
      add(variable('x'), real(5)),
      add(variable('x'), real(5))
    )).toBeTruthy()
  })

  it('returns false for equivalent binary functions with inequivalent children', () =>{
    expect(deepEquals(
      add(variable('x'), real(5)),
      add(variable('y'), real(10))
    )).toBeFalsy()
  })

  it('returns false for inequivalent binary functions', () => {
    expect(deepEquals(
      add(variable('x'), variable('y')),
      multiply(variable('x'), variable('y'))
    )).toBeFalsy()
  })
})

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
      value: {[$kind]: 'Absolute', expression: variable('x')},
      log: [{input: variable('x').value, action: 'absolute'}]
    })
  })

  it('returns a NaN for Nil input', () => {
    expect(absolute(nil)).toEqual({
      value: {[$kind]: 'NaN', value: NaN},
      log: [{input: nil.value, action: 'not a number'}]
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
      value: {[$kind]: 'Addition', left: variable('x'), right: variable('y')},
      log: [{
        input: [variable('x').value, variable('y').value],
        action: 'addition'
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

  it('returns NaN if the left operand is nil', () => {
    expect(add(nil, real(5))).toEqual({
      value: nan.value,
      log: [{
        input: [nil.value, real(5).value],
        action: 'not a number'
      }]
    })
  })

  it('returns NaN if the right operand is nil', () => {
    expect(add(variable('x'), nil)).toEqual({
      value: nan.value,
      log: [{
        input: [variable('x').value, nil.value],
        action: 'not a number'
      }]
    })
  })

  it('returns the right operand if the left is zero', () => {
    expect(add(real(0), variable('x'))).toEqual({
      value: variable('x').value,
      log: [
        {
          input: [real(0).value, variable('x').value],
          action: 're-order operands'
        },
        {
          input: [variable('x').value, real(0).value],
          action: 'additive identity'
        }
      ]
    })
  })

  it('returns the left operand if the right is zero', () => {
    expect(add(variable('x'), real(0))).toEqual({
      value: variable('x').value,
      log: [
        {
          input: [variable('x').value, real(0).value],
          action: 'additive identity'
        }
      ]
    })
  })

  it('reorders primitives to the right', () => {
    expect(add(real(5), variable('x'))).toEqual({
      value: {[$kind]: 'Addition', left: variable('x'), right: real(5)},
      log: [
        {
          input: [real(5).value, variable('x').value],
          action: 're-order operands'
        },
        {
          input: [variable('x').value, real(5).value],
          action: 'addition'
        }
      ]
    })
  })

  it('combines reals across nesting levels', () => {
    expect(add(add(variable('x'), real(5)), real(10))).toEqual({
      value: {[$kind]: 'Addition', left: variable('x'), right: real(15)},
      log: [
        {
          input: [variable('x').value, real(5).value],
          action: 'addition'
        },
        {
          input: [add(variable('x'), real(5)).value, real(10).value],
          action: 'combine primitives across nesting levels'
        },
        {
          input: [real(5).value, real(10).value],
          action: 'real addition'
        },
        {
          input: [variable('x').value, real(15).value],
          action: 'addition'
        }
      ]
    })
  })

  it('doubles the left operand if equivalent to the right', () => {
    expect(add(variable('x'), variable('x'))).toEqual({
      value: multiply(real(2), variable('x')).value,
      log: [
        {
          input: [variable('x').value, variable('x').value],
          action: 'equivalence: replaced with double'
        },
        {
          input: [real(2).value, variable('x').value],
          action: 'multiplication'
        }
      ]
    })
  })

  it('doubles a right operand if equivalent to a left-nested-add left operand', () => {
    expect(add(add(variable('x'), variable('y')), variable('x'))).toEqual({
      value: add(multiply(real(2), variable('x')), variable('y')).value,
      log: [
        {
          input: [variable('x').value, variable('y').value],
          action: 'addition'
        },
        {
          input: [add(variable('x'), variable('y')).value, variable('x').value],
          action: 'combined like terms'
        },
        {
          input: [real(2).value, variable('x').value],
          action: 'multiplication'
        },
        {
          input: [multiply(real(2), variable('x')).value, variable('y').value],
          action: 'addition'
        }
      ]
    })
  })

  it('logs all layers of an operation without loss', () => {
    expect(add(variable('x'), add(variable('y'), add(real(5), real(-5))))).toEqual({
      value: add(variable('x'), variable('y')).value,
      log: [
        {
          input: [real(5).value, real(-5).value],
          action: 'real addition'
        },
        {
          input: [variable('y').value, real(0).value],
          action: 'additive identity'
        },
        {
          input: [variable('x').value, variable('y').value],
          action: 'addition'
        }
      ]
    })
  })
})

describe('subtract', () => {
  it('returns a Writer<Real> for two real inputs', () => {
    expect(subtract(real(4), real(5))).toEqual({
      value: real(-1).value,
      log: [
        {
          input: [real(-1).value, real(5).value],
          action: 'real multiplication'
        },
        {
          input: [real(4).value, real(-5).value],
          action: 'real addition'
        }
      ]
    })
  })

  it('returns a Writer<Addition> for variable inputs', () => {
    expect(subtract(variable('x'), variable('y'))).toEqual({
      value: add(variable('x'), multiply(real(-1), variable('y'))).value,
      log: [
        {
          input: [real(-1).value, variable('y').value],
          action: 'multiplication'
        },
        {
          input: [variable('x').value, multiply(real(-1), variable('y')).value],
          action: 'addition'  
        }
      ]
    })
  })
})

describe('negate', () => {
  it('returns a Writer<Multiplication> for variable inputs', () => {
    expect(negate(variable('x'))).toEqual({
      value: multiply(real(-1), variable('x')).value,
      log: [
        {
          input: [real(-1).value, variable('x').value],
          action: 'multiplication'  
        }
      ]
    })
  })
})

describe('double', () => {
  it('returns a Writer<Multiplication for variable inputs', () => {
    expect(double(variable('x'))).toEqual({
      value: multiply(real(2), variable('x')).value,
      log: [
        {
          input: [real(2).value, variable('x').value],
          action: 'multiplication'
        }
      ]
    })
  })
})
