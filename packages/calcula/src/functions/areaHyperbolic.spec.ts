import { expectCloseTo } from './expectations'
import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { 
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  acosh, asinh, atanh, asech, acsch, acoth 
} from './areaHyperbolic'

describe('acosh', () => {
  it('calculates the area hyperbolic cosine of a real value', () => {
    expectCloseTo(acosh(real(1)), real(0), 10)
  })

  it('calculates the area hyperbolic cosine of a complex number', () => {
    expectCloseTo(acosh(complex(2, 1)), complex(1.469351744368, 0.507356303217), 10)
  })

  it('generates an AreaHyperbolicCosine node of a variable expression', () => {
    expect(acosh(variable('x'))).toEqual(new AreaHyperbolicCosine(variable('x')))
  })
})

describe('asinh', () => {
  it('calculates the area hyperbolic sine of a real value', () => {
    expectCloseTo(asinh(real(1)), real(0.88137358701), 10)
  })

  it('calculates the area hyperbolic sine of a complex number', () => {
    expectCloseTo(asinh(complex(0, 1)), complex(0, 1.57079632679), 7)
  })

  it('generates an AreaHyperbolicSine node of a variable expression', () => {
    expect(asinh(variable('x'))).toEqual(new AreaHyperbolicSine(variable('x')))
  })
})

describe('atanh', () => {
  it('calculates the area hyperbolic tangent of a real value', () => {
    expectCloseTo(atanh(real(1)), real(Infinity), 10)
  })

  it('calculates the area hyperbolic tangent of a complex number', () => {
    expectCloseTo(atanh(complex(0, 1)), complex(0, 0.78539816339), 10)
  })

  it('generates an AreaHyperbolicTangent node of a variable expression', () => {
    expect(atanh(variable('x'))).toEqual(new AreaHyperbolicTangent(variable('x')))
  })
})

describe('asech', () => {
  it('calculates the area hyperbolic secant of a real value', () => {
    expectCloseTo(asech(real(1)), real(0), 10)
  })

  it('calculates the area hyperbolic secant of a complex number', () => {
    expectCloseTo(asech(complex(0, 1)), complex(0.88137358701, -1.57079632679), 10)
  })

  it('generates an AreaHyperbolicSecant node of a variable expression', () => {
    expect(asech(variable('x'))).toEqual(new AreaHyperbolicSecant(variable('x')))
  })
})

describe('acsch', () => {
  it('calculates the area hyperbolic cosecant of a real value', () => {
    expectCloseTo(acsch(real(1)), real(0.88137358701), 10)
  })

  it('calculates the area hyperbolic cosecant of a complex number', () => {
    expectCloseTo(acsch(complex(0, 1)), complex(0, -1.57079632679), 7)
  })

  it('generates an AreaHyperbolicCosecant node of a variable expression', () => {
    expect(acsch(variable('x'))).toEqual(new AreaHyperbolicCosecant(variable('x')))
  })
})

describe('acoth', () => {
  it('calculates the area hyperbolic cotangent of a real value', () => {
    expectCloseTo(acoth(real(1)), real(Infinity), 10)
  })

  it('calculates the area hyperbolic cotangent of a complex number', () => {
    expectCloseTo(acoth(complex(0, 1)), complex(0, -0.78539816339), 10)
  })

  it('generates an AreaHyperbolicCotangent node of a variable expression', () => {
    expect(acoth(variable('x'))).toEqual(new AreaHyperbolicCotangent(variable('x')))
  })
})
