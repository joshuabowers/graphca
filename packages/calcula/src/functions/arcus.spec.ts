import { unit } from '../monads/writer'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  acos, asin, atan, asec, acsc, acot,
  $acos, $asin, $atan, $asec, $acsc, $acot
} from './arcus'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'

describe('$acos', () => {
  it('generates an ArcusCosine for a TreeNode input', () => {
    expect($acos(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.arcus, species: Species.acos,
      expression: unit(variable('x').value)
    })
  })
})

describe('acos', () => {
  it('calculates the arcus cosine of a real number', () => {
    expectCloseTo(acos(real(1)), real(0), 10)
  })

  it('calculates the arcus cosine of a complex number', () => {
    expectCloseTo(acos(complex([0, 1])), complex([1.57079632679, -0.881373587]), 10)
  })

  it('generates an arcus cosine node for a variable expression', () => {
    expectWriterTreeNode(
      acos(variable('x')),
      $acos(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['acos(x)', 'acos(x)', 'arcus cosine']
    )
  })
})

describe('$asin', () => {
  it('generates an ArcusSine for a TreeNode input', () => {
    expect($asin(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.arcus, species: Species.asin,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      asin(variable('x')),
      $asin(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['asin(x)', 'asin(x)', 'arcus sine']
    )
  })
})

describe('$atan', () => {
  it('generates an ArcusTangent for a TreeNode input', () => {
    expect($atan(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.arcus, species: Species.atan,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      atan(variable('x')),
      $atan(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['atan(x)', 'atan(x)', 'arcus tangent']
    )
  })
})

describe('$asec', () => {
  it('generates an ArcusSecant for a TreeNode input', () => {
    expect($asec(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.arcus, species: Species.asec,
      expression: unit(variable('x').value)
    })
  })
})

describe('asec', () => {
  it('calculates the arcus secant of a real number', () => {
    const v = Math.acos(1 / 2).toString()
    expectWriterTreeNode(
      asec(real(2)),
      real(Math.acos(1 / 2))
    )(
      ['2', '2', 'given primitive'],
      ['asec(2)', 'acos(2 ^ -1)', 'real arcus secant'],
      ['-1', '-1', 'given primitive'],
      ['2 ^ -1', '0.5', 'real exponentiation'],
      ['0.5', '0.5', 'given primitive'],
      ['acos(0.5)', v, 'real arcus cosine'],
      [v, v, 'given primitive']
    )
  })

  it('calculates the arcus secant of a complex number', () => {
    expectCloseTo(asec(complex([0, 1])), complex([1.57079632679, 0.881373587]), 10)
  })

  it('generates an arcus secant node for a variable expression', () => {
    expectWriterTreeNode(
      asec(variable('x')),
      $asec(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['asec(x)', 'asec(x)', 'arcus secant']
    )
  })
})

describe('$acsc', () => {
  it('generates an ArcusCosecant for a TreeNode input', () => {
    expect($acsc(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.arcus, species: Species.acsc,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      acsc(variable('x')),
      $acsc(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['acsc(x)', 'acsc(x)', 'arcus cosecant']
    )
  })
})

describe('$acot', () => {
  it('generates an ArcusCotangent for a TreeNode input', () => {
    expect($acot(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.arcus, species: Species.acot,
      expression: unit(variable('x').value)
    })
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
    expectWriterTreeNode(
      acot(variable('x')),
      $acot(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['acot(x)', 'acot(x)', 'arcus cotangent']
    )
  })
})
