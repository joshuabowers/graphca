import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  ArcusCosine, ArcusSine, ArcusTangent,
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  acos, asin, atan, asec, acsc, acot 
} from './arcus'
import { expectCloseTo, expectWriter } from '../utility/expectations'

describe('acos', () => {
  it('calculates the arcus cosine of a real number', () => {
    expectCloseTo(acos(real(1)), real(0), 10)
  })

  it('calculates the arcus cosine of a complex number', () => {
    expectCloseTo(acos(complex([0, 1])), complex([1.57079632679, -0.881373587]), 10)
  })

  it('generates an arcus cosine node for a variable expression', () => {
    expectWriter(acos(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.arcus, species: Species.acos,
        expression: variable('x')
      } as ArcusCosine,
      [variable('x').value, 'arcus cosine']
    )
  })
})

describe('asin', () => {
  it('calculates the arcus sine of a real number', () => {
    expectCloseTo(asin(real(1)), real(1.57079632679), 10)
  })

  it('calculates the arcus sine of a complex number', () => {
    expectCloseTo(asin(complex([0, 1])), complex([0, 0.881373587]), 10)
  })

  it('generates an arcus sine node for a variable expression', () => {
    expectWriter(asin(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.arcus, species: Species.asin,
        expression: variable('x')
      } as ArcusSine,
      [variable('x').value, 'arcus sine']
    )
  })
})

describe('atan', () => {
  it('calculates the arcus tangent of a real number', () => {
    expectCloseTo(atan(real(1)), real(0.78539816339), 10)
  })

  it('calculates the arcus tangent of a complex number', () => {
    expectCloseTo(atan(complex([0, 1])), complex([0, Infinity]), 10)
  })

  it('generates an arcus tangent node for a variable expression', () => {
    expectWriter(atan(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.arcus, species: Species.atan,
        expression: variable('x')
      } as ArcusTangent,
      [variable('x').value, 'arcus tangent']
    )
  })
})

describe('asec', () => {
  it('calculates the arcus secant of a real number', () => {
    expectCloseTo(asec(real(2)), real(1.04719755119), 10)
  })

  it('calculates the arcus secant of a complex number', () => {
    expectCloseTo(asec(complex([0, 1])), complex([1.57079632679, 0.881373587]), 10)
  })

  it('generates an arcus secant node for a variable expression', () => {
    expectWriter(asec(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.arcus, species: Species.asec,
        expression: variable('x')
      } as ArcusSecant,
      [variable('x').value, 'arcus secant']
    )
  })
})

describe('acsc', () => {
  it('calculates the arcus cosecant of a real number', () => {
    expectCloseTo(acsc(real(1)), real(1.57079632679), 10)
  })

  it('calculates the arcus cosecant of a complex number', () => {
    expectCloseTo(acsc(complex([0, 1])), complex([0, -0.881373587]), 10)
  })

  it('generates an arcus cosecant node for a variable expression', () => {
    expectWriter(acsc(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.arcus, species: Species.acsc,
        expression: variable('x')
      } as ArcusCosecant,
      [variable('x').value, 'arcus cosecant']
    )
  })
})

describe('acot', () => {
  it('calculates the arcus cotangent of a real number', () => {
    expectCloseTo(acot(real(1)), real(0.78539816339), 10)
  })

  it('calculates the arcus cotangent of a complex number', () => {
    expectCloseTo(acot(complex([1, 1])), complex([0.553574358897, -0.402359478108]), 10)
  })

  it('generates an arcus cotangent node for a variable expression', () => {
    expectWriter(acot(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.arcus, species: Species.acot,
        expression: variable('x')
      } as ArcusCotangent,
      [variable('x').value, 'arcus cotangent']
    )
  })
})
