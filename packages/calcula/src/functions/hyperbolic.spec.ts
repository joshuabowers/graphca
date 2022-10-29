import { unit } from '../monads/writer'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  cosh, sinh, tanh, sech, csch, coth,
  $cosh, $sinh, $tanh, $sech, $csch, $coth
} from './hyperbolic'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'

describe('$cosh', () => {
  it('generates a HyperbolicCosine for a TreeNode input', () => {
    expect($cosh(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.hyperbolic, species: Species.cosh,
      expression: unit(variable('x').value)
    })  
  })
})

describe('cosh', () => {
  it('calculates the hyperbolic cosine of a real value', () => {
    expectCloseTo(cosh(real(1)), real(1.543080634815), 10)
  })
  
  it('calculates the hyperbolic cosine of a complex number', () => {
    expectCloseTo(cosh(complex([0, 1])), complex([0.540302305868, 0]), 10)
  })

  it('returns a hyperbolic cosine node if not valuable', () => {
    expectWriterTreeNode(
      cosh(variable('x')),
      $cosh(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['cosh(x)', 'cosh(x)', 'hyperbolic cosine']
    )
  })
})

describe('$sinh', () => {
  it('generates a HyperbolicSine for a TreeNode input', () => {
    expect($sinh(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.hyperbolic, species: Species.sinh,
      expression: unit(variable('x').value)
    })  
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
    expectWriterTreeNode(
      sinh(variable('x')),
      $sinh(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['sinh(x)', 'sinh(x)', 'hyperbolic sine']
    )
  })
})

describe('$tanh', () => {
  it('generates a HyperbolicTangent for a TreeNode input', () => {
    expect($tanh(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.hyperbolic, species: Species.tanh,
      expression: unit(variable('x').value)
    })  
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
    expectWriterTreeNode(
      tanh(variable('x')),
      $tanh(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['tanh(x)', 'tanh(x)', 'hyperbolic tangent']
    )
  })
})

describe('$sech', () => {
  it('generates a HyperbolicSecant for a TreeNode input', () => {
    expect($sech(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.hyperbolic, species: Species.sech,
      expression: unit(variable('x').value)
    })  
  })
})

describe('sech', () => {
  it('calculates the hyperbolic secant of a real value', () => {
    const v = (1 / Math.cosh(1)).toString()
    const w = Math.cosh(1).toString()
    expectWriterTreeNode(
      sech(real(1)),
      real(1 / Math.cosh(1))
    )(
      ['1', '1', 'given primitive'],
      ['sech(1)', 'cosh(1) ^ -1', 'real hyperbolic secant'],
      ['cosh(1)', w, 'real hyperbolic cosine'],
      [w, w, 'given primitive'],
      ['-1', '-1', 'given primitive'],
      [`${w} ^ -1`, v, 'real exponentiation'],
      [v, v, 'given primitive']
    )
  })

  it('calculates the hyperbolic secant of a complex number', () => {
    expectCloseTo(sech(complex([0, 1])), complex([1.850815717680, 0]), 10)
  })

  it('returns a hyperbolic secant node if not valuable', () => {
    expectWriterTreeNode(
      sech(variable('x')),
      $sech(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['sech(x)', 'sech(x)', 'hyperbolic secant']
    )
  })
})

describe('$csch', () => {
  it('generates a HyperbolicCosecant for a TreeNode input', () => {
    expect($csch(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.hyperbolic, species: Species.csch,
      expression: unit(variable('x').value)
    })  
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
    expectWriterTreeNode(
      csch(variable('x')),
      $csch(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['csch(x)', 'csch(x)', 'hyperbolic cosecant']
    )
  })
})

describe('$coth', () => {
  it('generates a HyperbolicCotangent for a TreeNode input', () => {
    expect($coth(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.hyperbolic, species: Species.coth,
      expression: unit(variable('x').value)
    })  
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
    expectWriterTreeNode(
      coth(variable('x')),
      $coth(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['coth(x)', 'coth(x)', 'hyperbolic cotangent']
    )
  })
})
