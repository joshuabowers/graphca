import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { 
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth 
} from './hyperbolic'
import { expectCloseTo } from './expectations'

describe('cosh', () => {
  it('calculates the hyperbolic cosine of a real value', () => {
    expectCloseTo(cosh(real(1)), real(1.543080634815), 10)
  })
  
  it('calculates the hyperbolic cosine of a complex number', () => {
    expectCloseTo(cosh(complex(0, 1)), complex(0.540302305868, 0), 10)
  })

  it('returns a hyperbolic cosine node if not valuable', () => {
    expect(cosh(variable('x'))).toEqual(new HyperbolicCosine(variable('x')))
  })
})

describe('sinh', () => {
  it('calculates the hyperbolic sine of a real value', () => {
    expectCloseTo(sinh(real(1)), real(1.175201193643), 10)
  })

  it('calculates the hyperbolic sine of a complex number', () => {
    expectCloseTo(sinh(complex(0, 1)), complex(0, 0.841470984807), 10)
  })

  it('returns a hyperbolic sine node if not valuable', () => {
    expect(sinh(variable('x'))).toEqual(new HyperbolicSine(variable('x')))
  })
})

describe('tanh', () => {
  it('calculates the hyperbolic tangent of a real value', () => {
    expectCloseTo(tanh(real(1)), real(0.761594155955), 10)
  })

  it('calculates the hyperbolic tangent of a complex number', () => {
    expectCloseTo(tanh(complex(0, 1)), complex(0, 1.557407724654), 10)
  })

  it('returns a hyperbolic tangent node if not valuable', () => {
    expect(tanh(variable('x'))).toEqual(new HyperbolicTangent(variable('x')))
  })
})

describe('sech', () => {
  it('calculates the hyperbolic secant of a real value', () => {
    expectCloseTo(sech(real(1)), real(0.648054273663), 10)
  })

  it('calculates the hyperbolic secant of a complex number', () => {
    expectCloseTo(sech(complex(0, 1)), complex(1.850815717680, 0), 10)
  })

  it('returns a hyperbolic secant node if not valuable', () => {
    expect(sech(variable('x'))).toEqual(new HyperbolicSecant(variable('x')))
  })
})

describe('csch', () => {
  it('calculates the hyperbolic cosecant of a real value', () => {
    expectCloseTo(csch(real(1)), real(0.850918128239), 10)
  })

  it('calculates the hyperbolic cosecant of a complex number', () => {
    expectCloseTo(csch(complex(0, 1)), complex(0, -1.188395105778), 10)
  })

  it('returns a hyperbolic cosecant node if not valuable', () => {
    expect(csch(variable('x'))).toEqual(new HyperbolicCosecant(variable('x')))
  })
})

describe('coth', () => {
  it('calculates the hyperbolic cotangent of a real value', () => {
    expectCloseTo(coth(real(1)), real(1.313035285499), 10)
  })

  it('calculates the hyperbolic cotangent of a complex number', () => {
    expectCloseTo(coth(complex(0, 1)), complex(0, -0.642092615934), 10)
  })

  it('returns a hyperbolic cotangent node if not valuable', () => {
    expect(coth(variable('x'))).toEqual(new HyperbolicCotangent(variable('x')))
  })
})
