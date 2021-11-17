import { Unicode } from '../MathSymbols';
import { 
  Tree, Real, Complex,
  real, complex
} from '../Tree'
import { treeParser } from "../treeParser";
import { Evaluation } from './Evaluation';

const expectReal = (actual: Real, expected: Real, precision: number) => {
  if(expected === Real.NaN) {
    expect(actual).toEqual(expected)
  } else {
    expect(actual.value).toBeCloseTo(expected.value, precision)
  }
}

const expectComplex = (actual: Complex, expected: Complex, precision: number) => {
  if(expected === Complex.NaN) {
    expect(actual).toEqual(expected)
  } else {
    expect(actual.a).toBeCloseTo(expected.a, precision)
    expect(actual.b).toBeCloseTo(expected.b, precision)  
  }
}

const expectObject = (input: string, expected: Tree, precision: number = 15) => {
  const parsed = treeParser.value(input)
  const evaluation = new Evaluation()
  let output: Tree | undefined = undefined
  expect(() => {output = parsed.accept(evaluation)}).not.toThrow()
  expect(output).not.toBeUndefined()
  if( expected instanceof Real ){
    expectReal(output as unknown as Real, expected, precision)
  } else if( expected instanceof Complex ){
    expectComplex(output as unknown as Complex, expected, precision)
  } else {
    expect(output).toMatchObject(expected)
  }
}

describe(Evaluation, () => {
  describe('without variables', () => {
    it('approximates e', () => {
      expectObject(Unicode.e, Real.E)
    })

    it('represents i as a complex', () => {
      expectObject(Unicode.i, complex(0, 1))
    })

    it('handles a zero imaginary as a complex', () => {
      expectObject(`0${Unicode.i}`, complex(0, 0))
    })

    it('approximates pi', () => {
      expectObject(Unicode.pi, Real.PI)
    })

    it('contemplates infinity', () => {
      expectObject(Unicode.infinity, Real.Infinity)
    })

    it('evaluates binary expressions', () => {
      expectObject('1 + 2', real(3))
      expectObject('1 - 2', real(-1))
      expectObject('2 * 3', real(6))
      expectObject('6 / 2', real(3))
    })

    it('computes negative infinity', () => {
      expectObject('(-5) / 0', real(-Infinity))
    })

    it('evaluates arithmetic with operator precedence', () => {
      expectObject('1 - 2 * 3', real(-5))
      expectObject('2 * 4 + 3 * 5', real(23))
    })

    it('evaluates arithmetic with left associativity', () => {
      expectObject('1 - 2 - 3', real(-4))
      expectObject('1 - 2 + 3', real(2))
      expectObject('3 * 4 / 2', real(6))
      expectObject('1024 / 32 / 8', real(4))
      expectObject('1 / 2 * 3', real(1.5))
    })

    it('evaluates exponents with right associativity', () => {
      expectObject('2 ^ 5', real(32))
      expectObject('2 ^ 3 ^ 2', real(512))
      expectObject('2 ^ 2 ^ 3', real(256))
    })

    it('converts a negative real to a complex when it is raised', () => {
      expectObject('(-1)^2', complex(1))
      expectObject('(-1)^0.5', complex(0, 1))
      expectObject('(-25)^0.5', complex(0, 5))
    })

    it('evaluates negations', () => {
      expectObject('-10', real(-10))
      expectObject('-(2 * 3)', real(-6))
      expectObject('-(-10)', real(10))
    })

    // TODO: revisit this once PI is implemented
    it('evaluates trigonometric functions', () => {
      expectObject('cos(0)', real(1))
      expectObject('sin(0)', real(0))
      expectObject('tan(0)', real(0))
    })

    it('evaluates arcus functions', () => {
      expectObject('acos(0)', real(Math.PI / 2))
      expectObject('asin(0)', real(0))
      expectObject('atan(0)', real(0))
    })

    it('evaluates hyperbolic functions', () => {
      expectObject('cosh(0)', real(1))
      expectObject('sinh(0)', real(0))
      expectObject('tanh(0)', real(0))
    })

    it('evaluates area hyperbolic functions', () => {
      expectObject('acosh(0)', Real.NaN)
      expectObject('asinh(0)', real(0))
      expectObject('atanh(0)', real(0))
    })

  })

  describe('with variables without scope', () => {

  })

  describe('with variables and scope', () => {

  })
})