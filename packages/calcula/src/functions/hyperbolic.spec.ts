import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth 
} from './hyperbolic'
import { expectCloseTo, expectWriter } from '../utility/expectations'

describe('cosh', () => {
  it('calculates the hyperbolic cosine of a real value', () => {
    expectCloseTo(cosh(real(1)), real(1.543080634815), 10)
  })
  
  it('calculates the hyperbolic cosine of a complex number', () => {
    expectCloseTo(cosh(complex([0, 1])), complex([0.540302305868, 0]), 10)
  })

  it('returns a hyperbolic cosine node if not valuable', () => {
    expectWriter(cosh(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.hyperbolic, species: Species.cosh,
        expression: variable('x')
      } as HyperbolicCosine,
      [variable('x').value, 'hyperbolic cosine']
    )
  })
})

describe('sinh', () => {
  it('calculates the hyperbolic sine of a real value', () => {
    expectCloseTo(sinh(real(1)), real(1.175201193643), 10)
  })

  it('calculates the hyperbolic sine of a complex number', () => {
    expectCloseTo(sinh(complex([0, 1])), complex([0, 0.841470984807]), 10)
  })

  it('returns a hyperbolic sine node if not valuable', () => {
    expectWriter(sinh(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.hyperbolic, species: Species.sinh,
        expression: variable('x')
      } as HyperbolicSine,
      [variable('x').value, 'hyperbolic sine']
    )
  })
})

describe('tanh', () => {
  it('calculates the hyperbolic tangent of a real value', () => {
    expectCloseTo(tanh(real(1)), real(0.761594155955), 10)
  })

  it('calculates the hyperbolic tangent of a complex number', () => {
    expectCloseTo(tanh(complex([0, 1])), complex([0, 1.557407724654]), 10)
  })

  it('returns a hyperbolic tangent node if not valuable', () => {
    expectWriter(tanh(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.hyperbolic, species: Species.tanh,
        expression: variable('x')
      } as HyperbolicTangent,
      [variable('x').value, 'hyperbolic tangent']
    )
  })
})

describe('sech', () => {
  it('calculates the hyperbolic secant of a real value', () => {
    expectCloseTo(sech(real(1)), real(0.648054273663), 10)
  })

  it('calculates the hyperbolic secant of a complex number', () => {
    expectCloseTo(sech(complex([0, 1])), complex([1.850815717680, 0]), 10)
  })

  it('returns a hyperbolic secant node if not valuable', () => {
    expectWriter(sech(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.hyperbolic, species: Species.sech,
        expression: variable('x')
      } as HyperbolicSecant,
      [variable('x').value, 'hyperbolic secant']
    )
  })
})

describe('csch', () => {
  it('calculates the hyperbolic cosecant of a real value', () => {
    expectCloseTo(csch(real(1)), real(0.850918128239), 10)
  })

  it('calculates the hyperbolic cosecant of a complex number', () => {
    expectCloseTo(csch(complex([0, 1])), complex([0, -1.188395105778]), 10)
  })

  it('returns a hyperbolic cosecant node if not valuable', () => {
    expectWriter(csch(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.hyperbolic, species: Species.csch,
        expression: variable('x')
      } as HyperbolicCosecant,
      [variable('x').value, 'hyperbolic cosecant']
    )
  })
})

describe('coth', () => {
  it('calculates the hyperbolic cotangent of a real value', () => {
    expectCloseTo(coth(real(1)), real(1.313035285499), 10)
  })

  it('calculates the hyperbolic cotangent of a complex number', () => {
    expectCloseTo(coth(complex([0, 1])), complex([0, -0.642092615934]), 10)
  })

  it('returns a hyperbolic cotangent node if not valuable', () => {
    expectWriter(coth(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.hyperbolic, species: Species.coth,
        expression: variable('x')
      } as HyperbolicCotangent,
      [variable('x').value, 'hyperbolic cotangent']
    )
  })
})
