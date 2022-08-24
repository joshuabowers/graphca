import { expectCloseTo, expectWriter } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
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
    expectCloseTo(acosh(complex([2, 1])), complex([1.469351744368, 0.507356303217]), 10)
  })

  it('generates an AreaHyperbolicCosine node of a variable expression', () => {
    expectWriter(acosh(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.acosh,
        expression: variable('x')
      } as AreaHyperbolicCosine,
      [variable('x').value, 'area hyperbolic cosine']
    )
  })
})

describe('asinh', () => {
  it('calculates the area hyperbolic sine of a real value', () => {
    expectCloseTo(asinh(real(1)), real(0.88137358701), 10)
  })

  it('calculates the area hyperbolic sine of a complex number', () => {
    expectCloseTo(asinh(complex([0, 1])), complex([0, 1.57079632679]), 7)
  })

  it('generates an AreaHyperbolicSine node of a variable expression', () => {
    expectWriter(asinh(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.asinh,
        expression: variable('x')
      } as AreaHyperbolicSine,
      [variable('x').value, 'area hyperbolic sine']
    )
  })
})

describe('atanh', () => {
  it('calculates the area hyperbolic tangent of a real value', () => {
    expectCloseTo(atanh(real(1)), real(Infinity), 10)
  })

  it('calculates the area hyperbolic tangent of a complex number', () => {
    expectCloseTo(atanh(complex([0, 1])), complex([0, 0.78539816339]), 10)
  })

  it('generates an AreaHyperbolicTangent node of a variable expression', () => {
    expectWriter(atanh(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.atanh,
        expression: variable('x')
      } as AreaHyperbolicTangent,
      [variable('x').value, 'area hyperbolic tangent']
    )
  })
})

describe('asech', () => {
  it('calculates the area hyperbolic secant of a real value', () => {
    expectCloseTo(asech(real(1)), real(0), 10)
  })

  it('calculates the area hyperbolic secant of a complex number', () => {
    expectCloseTo(asech(complex([0, 1])), complex([0.88137358701, -1.57079632679]), 10)
  })

  it('generates an AreaHyperbolicSecant node of a variable expression', () => {
    expectWriter(asech(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.asech,
        expression: variable('x')
      } as AreaHyperbolicSecant,
      [variable('x').value, 'area hyperbolic secant']
    )
  })
})

describe('acsch', () => {
  it('calculates the area hyperbolic cosecant of a real value', () => {
    expectCloseTo(acsch(real(1)), real(0.88137358701), 10)
  })

  it('calculates the area hyperbolic cosecant of a complex number', () => {
    expectCloseTo(acsch(complex([0, 1])), complex([0, -1.57079632679]), 7)
  })

  it('generates an AreaHyperbolicCosecant node of a variable expression', () => {
    expectWriter(acsch(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.acsch,
        expression: variable('x')
      } as AreaHyperbolicCosecant,
      [variable('x').value, 'area hyperbolic cosecant']
    )
  })
})

describe('acoth', () => {
  it('calculates the area hyperbolic cotangent of a real value', () => {
    expectCloseTo(acoth(real(1)), real(Infinity), 10)
  })

  it('calculates the area hyperbolic cotangent of a complex number', () => {
    expectCloseTo(acoth(complex([0, 1])), complex([0, -0.78539816339]), 10)
  })

  it('generates an AreaHyperbolicCotangent node of a variable expression', () => {
    expectWriter(acoth(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.acoth,
        expression: variable('x')
      } as AreaHyperbolicCotangent,
      [variable('x').value, 'area hyperbolic cotangent']
    )
  })
})
