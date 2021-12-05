import { expectCloseTo } from './expectations'
import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { 
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  cos, sin, tan, sec, csc, cot 
} from './trigonometric'

describe('cos', () => {
  it('returns the appropriate real value when given real', () => {
    expect(cos(real(0.5))).toEqual(real(Math.cos(0.5)))
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cos(complex(1, 2)), complex(2.032723007019, -3.051897799151), 10)
  })

  it('returns a expression when given non-constant', () => {
    expect(cos(variable('x'))).toEqual(new Cosine(variable('x')))
  })
})

describe('sin', () => {
  it('returns the appropriate real value when given real', () => {
    expect(sin(real(0.5))).toEqual(real(Math.sin(0.5)))
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sin(complex(1, 2)), complex(3.16577851321616, 1.95960104142160), 10)
  })

  it('returns a expression when given non-constant', () => {
    expect(sin(variable('x'))).toEqual(new Sine(variable('x')))
  })
})

describe('tan', () => {
  it('returns the appropriate real value when given real', () => {
    expect(tan(real(0.5))).toEqual(real(Math.tan(0.5)))
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(tan(complex(1, 2)), complex(0.033812826079, 1.014793616146), 10)
  })

  it('returns a expression when given non-constant', () => {
    expect(tan(variable('x'))).toEqual(new Tangent(variable('x')))
  })
})

describe('sec', () => {
  it('returns the appropriate real value when given real', () => {
    expect(sec(real(0.5))).toEqual(real(1 / Math.cos(0.5)))
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sec(complex(1, 2)), complex(0.15117629826, 0.22697367539), 10)
  })

  it('returns a expression when given non-constant', () => {
    expect(sec(variable('x'))).toEqual(new Secant(variable('x')))
  })
})

describe('csc', () => {
  it('returns the appropriate real value when given real', () => {
    expect(csc(real(0.5))).toEqual(real(1 / Math.sin(0.5)))
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(csc(complex(1, 2)), complex(0.228375065599, -0.141363021612), 10)
  })

  it('returns a expression when given non-constant', () => {
    expect(csc(variable('x'))).toEqual(new Cosecant(variable('x')))
  })
})

describe('cot', () => {
  it('returns the appropriate real value when given real', () => {
    expect(cot(real(0.5))).toEqual(real(1 / Math.tan(0.5)))
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cot(complex(1, 2)), complex(0.0327977555337, -0.9843292264581), 10)
  })

  it('returns a expression when given non-constant', () => {
    expect(cot(variable('x'))).toEqual(new Cotangent(variable('x')))
  })
})
