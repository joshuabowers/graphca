import { unit } from '../monads/writer'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'
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
      $acosh(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['acosh(x)', 'acosh(x)', 'area hyperbolic cosine']
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
      $asinh(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['asinh(x)', 'asinh(x)', 'area hyperbolic sine']
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
      $atanh(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['atanh(x)', 'atanh(x)', 'area hyperbolic tangent']
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
      ['2', '2', 'given primitive'],
      ['asech(2)', 'acosh(2 ^ -1)', 'real area hyperbolic secant'],
      ['-1', '-1', 'given primitive'],
      ['2 ^ -1', '0.5', 'real exponentiation'],
      ['0.5', '0.5', 'given primitive'],
      ['acosh(0.5)', v, 'real area hyperbolic cosine'],
      [v, v, 'given primitive']
    )
  })

  it('calculates the area hyperbolic secant of a complex number', () => {
    expectCloseTo(asech(complex([0, 1])), complex([0.88137358701, -1.57079632679]), 10)
  })

  it('generates an AreaHyperbolicSecant node of a variable expression', () => {
    expectWriterTreeNode(
      asech(variable('x')),
      $asech(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['asech(x)', 'asech(x)', 'area hyperbolic secant']
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
      $acsch(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['acsch(x)', 'acsch(x)', 'area hyperbolic cosecant']
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
      $acoth(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['acoth(x)', 'acoth(x)', 'area hyperbolic cotangent']
    )
  })
})
