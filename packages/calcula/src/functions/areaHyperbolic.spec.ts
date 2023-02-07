import { unit } from '../monads/writer'
import { 
  expectCloseTo, expectWriterTreeNode,
  realOps, variableOps, raiseOps,
  acoshOps, asinhOps, atanhOps, asechOps, acschOps, acothOps
} from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  acosh, asinh, atanh, asech, acsch, acoth,
  $acosh, $asinh, $atanh, $asech, $acsch, $acoth
} from './areaHyperbolic'

describe('$acosh', () => {
  it('generates an AreaHyperbolicCosine for a TreeNode input', () => {
    expect(
      $acosh(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.acosh,
      expression: unit(variable('x').value)
    })
  })
})

describe('acosh', () => {
  it('calculates the area hyperbolic cosine of a real value', () => {
    expectCloseTo(acosh(real(1)), real(0), 10)
  })

  it('calculates the area hyperbolic cosine of a complex number', () => {
    expectCloseTo(acosh(complex([2, 1])), complex([1.469351744368, 0.507356303217]), 10)
  })

  it('generates an AreaHyperbolicCosine node of a variable expression', () => {
    expectWriterTreeNode(
      acosh(variable('x')),
      $acosh(variable('x'))[0]
    )(
      ...acoshOps(
        'created area hyperbolic cosine',
        variableOps('x'),
        []
      )
    )
  })
})

describe('$asinh', () => {
  it('generates an AreaHyperbolicSine for a TreeNode input', () => {
    expect(
      $asinh(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.asinh,
      expression: unit(variable('x').value)
    })  
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
    expectWriterTreeNode(
      asinh(variable('x')),
      $asinh(variable('x'))[0]
    )(
      ...asinhOps(
        'created area hyperbolic sine',
        variableOps('x'),
        []
      )
    )
  })
})

describe('$atanh', () => {
  it('generates an AreaHyperbolicTangent for a TreeNode input', () => {
    expect(
      $atanh(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.atanh,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      atanh(variable('x')),
      $atanh(variable('x'))[0]
    )(
      ...atanhOps(
        'created area hyperbolic tangent',
        variableOps('x'),
        []
      )
    )
  })
})

describe('$asech', () => {
  it('generates an AreaHyperbolicSecant for a TreeNode input', () => {
    expect(
      $asech(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.asech,
      expression: unit(variable('x').value)
    })
  })
})

describe('asech', () => {
  it('calculates the area hyperbolic secant of a real value', () => {
    const v = Math.acosh(1 / 2).toString()
    expectWriterTreeNode(
      asech(real(2)),
      real(Math.acosh(1 / 2))
    )(
      ...asechOps(
        'real area hyperbolic secant',
        realOps('2'),
        acoshOps(
          'real area hyperbolic cosine',
          raiseOps(
            'real exponentiation',
            realOps('2'),
            realOps('-1'),
            realOps('0.5')
          ),
          realOps(v)
        )
      )
    )
  })

  it('calculates the area hyperbolic secant of a complex number', () => {
    expectCloseTo(asech(complex([0, 1])), complex([0.88137358701, -1.57079632679]), 10)
  })

  it('generates an AreaHyperbolicSecant node of a variable expression', () => {
    expectWriterTreeNode(
      asech(variable('x')),
      $asech(variable('x'))[0]
    )(
      ...asechOps(
        'created area hyperbolic secant',
        variableOps('x'),
        []
      )
    )
  })
})

describe('$acsch', () => {
  it('generates an AreaHyperbolicCosecant for a TreeNode input', () => {
    expect(
      $acsch(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.acsch,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      acsch(variable('x')),
      $acsch(variable('x'))[0]
    )(
      ...acschOps(
        'created area hyperbolic cosecant',
        variableOps('x'),
        []
      )
    )
  })
})

describe('$acoth', () => {
  it('generates an AreaHyperbolicCotangent for a TreeNode input', () => {
    expect(
      $acoth(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: Genera.areaHyperbolic, species: Species.acoth,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      acoth(variable('x')),
      $acoth(variable('x'))[0]
    )(
      ...acothOps(
        'created area hyperbolic cotangent',
        variableOps('x'),
        []
      )
    )
  })
})
