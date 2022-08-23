import { Clades, Species } from '../utility/tree';
import { real, complex, boolean, nil, nan } from '../primitives'
import { variable } from "../variable";
import { abs } from "./absolute";

describe('abs', () => {
  it('returns a Writer<Real> for a real input', () => {
    expect(abs(real(-5))).toEqual({
      value: real(5).value,
      log: [{input: real(-5).value, action: 'absolute value'}]
    })
  })

  it('returns a Writer<Complex> for a complex input', () => {
    expect(abs(complex([1, 2]))).toEqual({
      value: complex([2.23606797749979, 0]).value,
      log: [{input: complex([1,2]).value, action: 'absolute value'}]
    })
  })

  it('returns a Writer<Boolean> for a boolean input', () => {
    expect(abs(boolean(true))).toEqual({
      value: boolean(true).value,
      log: [{input: boolean(true).value, action: 'absolute value'}]
    })
  })

  it('returns a Writer<Absolute> for variable input', () => {
    expect(abs(variable('x'))).toEqual({
      value: {
        clade: Clades.unary, genus: undefined, species: Species.abs, 
        expression: variable('x')
      },
      log: [{input: variable('x').value, action: 'absolute'}]
    })
  })

  it('returns a NaN for Nil input', () => {
    expect(abs(nil)).toEqual({
      value: nan.value,
      log: [{input: nil.value, action: 'not a number'}]
    })
  })
})
