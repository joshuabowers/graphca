import { unit } from '../monads/writer'
import { 
  expectToEqualWithSnapshot, expectCloseTo
} from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex } from '../primitives'
import { variable } from '../variable'
import {
  cos, sin, tan, sec, csc, cot,
  $cos, $sin, $tan, $sec, $csc, $cot
} from './trigonometric'

describe('$cos', () => {
  it('generates a Cosine for a TreeNode input', () => {
    expect($cos(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.trigonometric, species: Species.cos,
      expression: unit(variable('x').value)
    })
  })
})

describe('cos', () => {
  it('returns the appropriate real value when given real', () => {
    expectToEqualWithSnapshot(
      cos(real(0.5)),
      real(Math.cos(0.5))
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cos(complex(1, 2)), complex(2.032723007019, -3.051897799151), 10)
  })

  it('returns an expression when given non-constant', () => {
    expectToEqualWithSnapshot(
      cos(variable('x')),
      $cos(variable('x'))[0]
    )
  })
})

describe('$sin', () => {
  it('generates a Sine for a TreeNode input', () => {
    expect($sin(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.trigonometric, species: Species.sin,
      expression: unit(variable('x').value)
    })
  })
})

describe('sin', () => {
  it('returns the appropriate real value when given real', () => {
    expectToEqualWithSnapshot(
      sin(real(0.5)),
      real(Math.sin(0.5))
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sin(complex(1, 2)), complex(3.16577851321616, 1.95960104142160), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectToEqualWithSnapshot(
      sin(variable('x')),
      $sin(variable('x'))[0]
    )
  })
})

describe('$tan', () => {
  it('generates a Tangent for a TreeNode input', () => {
    expect($tan(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.trigonometric, species: Species.tan,
      expression: unit(variable('x').value)
    })
  })
})

describe('tan', () => {
  it('returns the appropriate real value when given real', () => {
    expectToEqualWithSnapshot(
      tan(real(0.5)),
      real(Math.tan(0.5))
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(tan(complex(1, 2)), complex(0.033812826079, 1.014793616146), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectToEqualWithSnapshot(
      tan(variable('x')),
      $tan(variable('x'))[0]
    )
  })
})

describe('$sec', () => {
  it('generates a Secant for a TreeNode input', () => {
    expect($sec(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.trigonometric, species: Species.sec,
      expression: unit(variable('x').value)
    })
  })
})


describe('sec', () => {
  it('returns the appropriate real value when given real', () => {
    expectToEqualWithSnapshot(
      sec(real(0.5)),
      real(1 / Math.cos(0.5))
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sec(complex(1, 2)), complex(0.15117629826, 0.22697367539), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectToEqualWithSnapshot(
      sec(variable('x')),
      $sec(variable('x'))[0]
    )
  })
})

describe('$csc', () => {
  it('generates a Cosecant for a TreeNode input', () => {
    expect($csc(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.trigonometric, species: Species.csc,
      expression: unit(variable('x').value)
    })
  })
})


describe('csc', () => {
  it('returns the appropriate real value when given real', () => {
    expectToEqualWithSnapshot(
      csc(real(0.5)),
      real(1 / Math.sin(0.5))
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(csc(complex(1, 2)), complex(0.228375065599, -0.141363021612), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectToEqualWithSnapshot(
      csc(variable('x')),
      $csc(variable('x'))[0]
    )
  })
})

describe('$cot', () => {
  it('generates a Cotangent for a TreeNode input', () => {
    expect($cot(unit(variable('x').value))[0]).toEqual({
      clade: Clades.unary, genus: Genera.trigonometric, species: Species.cot,
      expression: unit(variable('x').value)
    })
  })
})

describe('cot', () => {
  it('returns the appropriate real value when given real', () => {
    expectToEqualWithSnapshot(
      cot(real(0.5)),
      real(1 / Math.tan(0.5))
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cot(complex(1, 2)), complex(0.0327977555337, -0.9843292264581), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectToEqualWithSnapshot(
      cot(variable('x')),
      $cot(variable('x'))[0]
    )
  })
})
