import { Unicode } from '../Unicode'

import { real, complex } from '../primitives'
import { variable } from '../variable'
import { add, subtract, multiply, divide, raise } from '../arithmetic'
import { 
  lb, permute, combine,
  cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  factorial, gamma, polygamma, abs
} from '../functions'

import { stringify } from './stringify'

describe('stringify', () => {
  describe('of lead nodes', () => {
    it('converts reals to strings', () => {
      expect(stringify(real(5))).toEqual('5')
    })
  
    it('converts complex numbers to strings', () => {
      expect(stringify(complex(2, -3))).toEqual(`2-3${Unicode.i}`)
    })
  
    it('converts variables to strings', () => {
      expect(stringify(variable('x'))).toEqual('x')
    })  
  })

  describe('of binary operations and functions', () => {
    it('converts additions to strings', () => {
      expect(stringify(add(variable('x'), real(1)))).toEqual('(x+1)')
    })
  
    it('converts subtractions to strings', () => {
      expect(stringify(subtract(variable('x'), real(1)))).toEqual(`(x+-1)`)
    })
  
    it('converts multiplications to strings', () => {
      expect(stringify(multiply(variable('x'), real(2)))).toEqual(`(2*x)`)
    })
  
    it('converts divisions to strings', () => {
      expect(stringify(divide(real(2), variable('x')))).toEqual(`(2*(x^-1))`)
    })
  
    it('converts exponentiations to strings', () => {
      expect(stringify(raise(variable('x'), real(2)))).toEqual('(x^2)')
    })
  
    it('converts logarithms to strings', () => {
      expect(stringify(lb(variable('x')))).toEqual('log(2,x)')
    })
  
    it('converts permutations to strings', () => {
      expect(stringify(permute(real(5), variable('x')))).toEqual('P(5,x)')
    })
  
    it('converts combinations to strings', () => {
      expect(stringify(combine(real(5), variable('x')))).toEqual('C(5,x)')
    })  
  })

  describe('of trigonometric functions', () => {
    it('converts Cosines to strings', () => {
      expect(stringify(cos(variable('x')))).toEqual('cos(x)')
    })

    it('converts Sines to strings', () => {
      expect(stringify(sin(variable('x')))).toEqual('sin(x)')
    })

    it('converts Tangents to strings', () => {
      expect(stringify(tan(variable('x')))).toEqual('tan(x)')
    })

    it('converts Secants to strings', () => {
      expect(stringify(sec(variable('x')))).toEqual('sec(x)')
    })

    it('converts Cosecants to strings', () => {
      expect(stringify(csc(variable('x')))).toEqual('csc(x)')
    })

    it('converts Cotangents to strings', () => {
      expect(stringify(cot(variable('x')))).toEqual('cot(x)')
    })
  })

  describe('of arcus functions', () => {
    it('converts ArcusCosines to strings', () => {
      expect(stringify(acos(variable('x')))).toEqual('acos(x)')
    })

    it('converts ArcusSines to strings', () => {
      expect(stringify(asin(variable('x')))).toEqual('asin(x)')
    })

    it('converts ArcusTangents to strings', () => {
      expect(stringify(atan(variable('x')))).toEqual('atan(x)')
    })

    it('converts ArcusSecants to strings', () => {
      expect(stringify(asec(variable('x')))).toEqual('asec(x)')
    })

    it('converts ArcusCosecants to strings', () => {
      expect(stringify(acsc(variable('x')))).toEqual('acsc(x)')
    })

    it('converts ArcusCotangents to strings', () => {
      expect(stringify(acot(variable('x')))).toEqual('acot(x)')
    })
  })

  describe('of hyperbolic functions', () => {
    it('converts HyperbolicCosines to strings', () => {
      expect(stringify(cosh(variable('x')))).toEqual('cosh(x)')
    })

    it('converts HyperbolicSines to strings', () => {
      expect(stringify(sinh(variable('x')))).toEqual('sinh(x)')
    })

    it('converts HyperbolicTangents to strings', () => {
      expect(stringify(tanh(variable('x')))).toEqual('tanh(x)')
    })

    it('converts HyperbolicSecants to strings', () => {
      expect(stringify(sech(variable('x')))).toEqual('sech(x)')
    })

    it('converts HyperbolicCosecants to strings', () => {
      expect(stringify(csch(variable('x')))).toEqual('csch(x)')
    })

    it('converts HyperbolicCotangents to strings', () => {
      expect(stringify(coth(variable('x')))).toEqual('coth(x)')
    })
  })

  describe('of area hyperbolic functions', () => {
    it('converts AreaHyperbolicCosines to strings', () => {
      expect(stringify(acosh(variable('x')))).toEqual('acosh(x)')
    })

    it('converts AreaHyperbolicSines to strings', () => {
      expect(stringify(asinh(variable('x')))).toEqual('asinh(x)')
    })

    it('converts AreaHyperbolicTangents to strings', () => {
      expect(stringify(atanh(variable('x')))).toEqual('atanh(x)')
    })

    it('converts AreaHyperbolicSecants to strings', () => {
      expect(stringify(asech(variable('x')))).toEqual('asech(x)')
    })

    it('converts AreaHyperbolicCosecants to strings', () => {
      expect(stringify(acsch(variable('x')))).toEqual('acsch(x)')
    })

    it('converts AreaHyperbolicCotangents to strings', () => {
      expect(stringify(acoth(variable('x')))).toEqual('acoth(x)')
    })
  })

  describe('of factorial-likes', () => {
    it('converts Factorials to strings', () => {
      expect(stringify(factorial(variable('x')))).toEqual('(x)!')
    })

    it('converts gamma to strings', () => {
      expect(stringify(gamma(variable('x')))).toEqual(`${Unicode.gamma}(x)`)
    })

    it('converts polygamma to strings', () => {
      expect(stringify(polygamma(real(0), variable('x')))).toEqual(`${Unicode.digamma}(0,x)`)
    })
  })

  it('converts absolute values to strings', () => {
    expect(stringify(abs(variable('x')))).toEqual('abs(x)')
  })
})
