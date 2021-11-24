import { 
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent
} from './Expression'
import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { acos, asin, atan, asec, acsc, acot } from './arcus'
import { expectCloseTo } from './expectations'

describe('acos', () => {
  it('calculates the arcus cosine of a real number', () => {
    expectCloseTo(acos(real(1)), real(0), 10)
  })

  it('calculates the arcus cosine of a complex number', () => {
    expectCloseTo(acos(complex(0, 1)), complex(1.57079632679, -0.881373587), 10)
  })

  it('generates an arcus cosine node for a variable expression', () => {
    expect(acos(variable('x'))).toEqual(new ArcusCosine(variable('x')))
  })
})

describe('asin', () => {
  it('calculates the arcus sine of a real number', () => {
    expectCloseTo(asin(real(1)), real(1.57079632679), 10)
  })

  it('calculates the arcus sine of a complex number', () => {
    expectCloseTo(asin(complex(0, 1)), complex(0, 0.881373587), 10)
  })

  it('generates an arcus sine node for a variable expression', () => {
    expect(asin(variable('x'))).toEqual(new ArcusSine(variable('x')))
  })
})

describe('atan', () => {
  it('calculates the arcus tangent of a real number', () => {
    expectCloseTo(atan(real(1)), real(0.78539816339), 10)
  })

  it('calculates the arcus tangent of a complex number', () => {
    expectCloseTo(atan(complex(0, 1)), complex(0, Infinity), 10)
  })

  it('generates an arcus tangent node for a variable expression', () => {
    expect(atan(variable('x'))).toEqual(new ArcusTangent(variable('x')))
  })
})

describe('asec', () => {
  it('calculates the arcus secant of a real number', () => {
    expectCloseTo(asec(real(2)), real(1.04719755119), 10)
  })

  it('calculates the arcus secant of a complex number', () => {
    expectCloseTo(asec(complex(0, 1)), complex(1.57079632679, 0.881373587), 10)
  })

  it('generates an arcus secant node for a variable expression', () => {
    expect(asec(variable('x'))).toEqual(new ArcusSecant(variable('x')))
  })
})

describe('acsc', () => {
  it('calculates the arcus cosecant of a real number', () => {
    expectCloseTo(acsc(real(1)), real(1.57079632679), 10)
  })

  it('calculates the arcus cosecant of a complex number', () => {
    expectCloseTo(acsc(complex(0, 1)), complex(0, -0.881373587), 10)
  })

  it('generates an arcus cosecant node for a variable expression', () => {
    expect(acsc(variable('x'))).toEqual(new ArcusCosecant(variable('x')))
  })
})

describe('acot', () => {
  it('calculates the arcus cotangent of a real number', () => {
    expectCloseTo(acot(real(1)), real(0.78539816339), 10)
  })

  it('calculates the arcus cotangent of a complex number', () => {
    expectCloseTo(acot(complex(1, 1)), complex(0.553574358897, -0.402359478108), 10)
  })

  it('generates an arcus cotangent node for a variable expression', () => {
    expect(acot(variable('x'))).toEqual(new ArcusCotangent(variable('x')))
  })
})
