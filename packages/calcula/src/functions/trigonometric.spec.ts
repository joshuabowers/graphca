import { expectCloseTo, expectWriter } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  cos, sin, tan, sec, csc, cot 
} from './trigonometric'

describe('cos', () => {
  it('returns the appropriate real value when given real', () => {
    expectWriter(cos(real(0.5)))(
      real(Math.cos(0.5)).value,
      [real(0.5).value, 'computed real cosine']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cos(complex([1, 2])), complex([2.032723007019, -3.051897799151]), 10)
  })

  it('returns an expression when given non-constant', () => {
    expectWriter(cos(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.trigonometric, species: Species.cos,
        expression: variable('x')
      } as Cosine,
      [variable('x').value, 'cosine']
    )
  })
})

describe('sin', () => {
  it('returns the appropriate real value when given real', () => {
    expectWriter(sin(real(0.5)))(
      real(Math.sin(0.5)).value,
      [real(0.5).value, 'computed real sine']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sin(complex([1, 2])), complex([3.16577851321616, 1.95960104142160]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriter(sin(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.trigonometric, species: Species.sin,
        expression: variable('x')
      } as Sine,
      [variable('x').value, 'sine']
    )
  })
})

describe('tan', () => {
  it('returns the appropriate real value when given real', () => {
    expectWriter(tan(real(0.5)))(
      real(Math.tan(0.5)).value,
      [real(0.5).value, 'computed real tangent']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(tan(complex([1, 2])), complex([0.033812826079, 1.014793616146]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriter(tan(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.trigonometric, species: Species.tan,
        expression: variable('x')
      } as Tangent,
      [variable('x').value, 'tangent']
    )
  })
})

describe('sec', () => {
  it('returns the appropriate real value when given real', () => {
    expectWriter(sec(real(0.5)))(
      real(1 / Math.cos(0.5)).value,
      [real(0.5).value, 'computed real cosine'],
      [[real(Math.cos(0.5)).value, real(-1).value], 'real exponentiation'],
      [real(0.5).value, 'computed real secant']
    ) // Hmm... This last log entry seems incorrect. Should probably be
    // the result of the middle operation.
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sec(complex([1, 2])), complex([0.15117629826, 0.22697367539]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriter(sec(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.trigonometric, species: Species.sec,
        expression: variable('x')
      } as Secant,
      [variable('x').value, 'secant']
    )
  })
})

describe('csc', () => {
  it('returns the appropriate real value when given real', () => {
    expectWriter(csc(real(0.5)))(
      real(1 / Math.sin(0.5)).value,
      [real(0.5).value, 'computed real sine'],
      [[real(Math.sin(0.5)).value, real(-1).value], 'real exponentiation'],
      [real(0.5).value, 'computed real cosecant']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(csc(complex([1, 2])), complex([0.228375065599, -0.141363021612]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriter(csc(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.trigonometric, species: Species.csc,
        expression: variable('x')
      } as Cosecant,
      [variable('x').value, 'cosecant']
    )
  })
})

describe('cot', () => {
  it('returns the appropriate real value when given real', () => {
    expectWriter(cot(real(0.5)))(
      real(1 / Math.tan(0.5)).value,
      [real(0.5).value, 'computed real tangent'],
      [[real(Math.tan(0.5)).value, real(-1).value], 'real exponentiation'],
      [real(0.5).value, 'computed real cotangent']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cot(complex([1, 2])), complex([0.0327977555337, -0.9843292264581]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriter(cot(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.trigonometric, species: Species.cot,
        expression: variable('x')
      } as Cotangent,
      [variable('x').value, 'cotangent']
    )
  })
})
