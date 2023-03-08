import { unit } from '../monads/writer'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import { 
  cosh, sinh, tanh, sech, csch, coth,
  $cosh, $sinh, $tanh, $sech, $csch, $coth
} from './hyperbolic'
import { 
  expectToEqualWithSnapshot, expectCloseTo
} from '../utility/expectations'

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
    expectCloseTo(cosh(complex(0, 1)), complex(0.540302305868, 0), 10)
  })

  it('returns a hyperbolic cosine node if not valuable', () => {
    expectToEqualWithSnapshot(
      cosh(variable('x')),
      $cosh(variable('x'))[0]
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
    expectCloseTo(sinh(complex(0, 1)), complex(0, 0.841470984807), 10)
  })

  it('returns a hyperbolic sine node if not valuable', () => {
    expectToEqualWithSnapshot(
      sinh(variable('x')),
      $sinh(variable('x'))[0]
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
    expectCloseTo(tanh(complex(0, 1)), complex(0, 1.557407724654), 10)
  })

  it('returns a hyperbolic tangent node if not valuable', () => {
    expectToEqualWithSnapshot(
      tanh(variable('x')),
      $tanh(variable('x'))[0]
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
    expectToEqualWithSnapshot(
      sech(real(1)),
      real(1 / Math.cosh(1))
    )
  })

  it('calculates the hyperbolic secant of a complex number', () => {
    expectCloseTo(sech(complex(0, 1)), complex(1.850815717680, 0), 10)
  })

  it('returns a hyperbolic secant node if not valuable', () => {
    expectToEqualWithSnapshot(
      sech(variable('x')),
      $sech(variable('x'))[0]
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
    expectCloseTo(csch(complex(0, 1)), complex(0, -1.188395105778), 10)
  })

  it('returns a hyperbolic cosecant node if not valuable', () => {
    expectToEqualWithSnapshot(
      csch(variable('x')),
      $csch(variable('x'))[0]
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
    expectCloseTo(coth(complex(0, 1)), complex(0, -0.642092615934), 10)
  })

  it('returns a hyperbolic cotangent node if not valuable', () => {
    expectToEqualWithSnapshot(
      coth(variable('x')),
      $coth(variable('x'))[0]
    )
  })
})
