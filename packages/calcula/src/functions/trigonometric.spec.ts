import { unit } from '../monads/writer'
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'
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
    const v = Math.cos(0.5).toString()
    expectWriterTreeNode(
      cos(real(0.5)),
      real(Math.cos(0.5))
    )(
      ['cos(0.5)', 'identified cosine'],
      ['cos(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['cos(0.5|)', 'processed argument'],
      ['cos(0.5)', 'real cosine'],
      [v, 'created real']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cos(complex([1, 2])), complex([2.032723007019, -3.051897799151]), 10)
  })

  it('returns an expression when given non-constant', () => {
    expectWriterTreeNode(
      cos(variable('x')),
      $cos(unit(variable('x').value))[0]
    )(
      ['cos(x)', 'identified cosine'],
      ['cos(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['cos(x|)', 'processed argument'],
      ['cos(x)', 'created cosine']
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
    const v = Math.sin(0.5).toString()
    expectWriterTreeNode(
      sin(real(0.5)),
      real(Math.sin(0.5))
    )(
      ['sin(0.5)', 'identified sine'],
      ['sin(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['sin(0.5|)', 'processed argument'],
      ['sin(0.5)', 'real sine'],
      [v, 'created real']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sin(complex([1, 2])), complex([3.16577851321616, 1.95960104142160]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriterTreeNode(
      sin(variable('x')),
      $sin(unit(variable('x').value))[0]
    )(
      ['sin(x)', 'identified sine'],
      ['sin(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['sin(x|)', 'processed argument'],
      ['sin(x)', 'created sine']
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
    const v = Math.tan(0.5).toString()
    expectWriterTreeNode(
      tan(real(0.5)),
      real(Math.tan(0.5))
    )(
      ['tan(0.5)', 'identified tangent'],
      ['tan(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['tan(0.5|)', 'processed argument'],
      ['tan(0.5)', 'real tangent'],
      [v, 'created real']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(tan(complex([1, 2])), complex([0.033812826079, 1.014793616146]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriterTreeNode(
      tan(variable('x')),
      $tan(unit(variable('x').value))[0]
    )(
      ['tan(x)', 'identified tangent'],
      ['tan(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['tan(x|)', 'processed argument'],
      ['tan(x)', 'created tangent']
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
    const v = (1 / Math.cos(0.5)).toString()
    const w = Math.cos(0.5).toString()
    expectWriterTreeNode(
      sec(real(0.5)),
      real(1 / Math.cos(0.5))
    )(
      ['sec(0.5)', 'identified secant'],
      ['sec(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['sec(0.5|)', 'processed argument'],
      ['sec(0.5)', 'real secant'],
      ['(cos(0.5)^-1)', 'identified exponentiation'],
      ['(|cos(0.5)^-1)', 'processing left operand'],
      ['cos(0.5)', 'identified cosine'],
      ['cos(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['cos(0.5|)', 'processed argument'],
      ['cos(0.5)', 'real cosine'],
      [w, 'created real'],
      [`(${w}^|-1)`, 'processed left operand; processing right operand'],
      ['-1', 'created real'],
      [`(${w}^-1|)`, 'processed right operand'],
      [`(${w}^-1)`, 'real exponentiation'],
      [v, 'created real']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(sec(complex([1, 2])), complex([0.15117629826, 0.22697367539]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriterTreeNode(
      sec(variable('x')),
      $sec(unit(variable('x').value))[0]
    )(
      ['sec(x)', 'identified secant'],
      ['sec(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['sec(x|)', 'processed argument'],
      ['sec(x)', 'created secant']
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
    const v = (1 / Math.sin(0.5)).toString()
    const w = Math.sin(0.5).toString()
    expectWriterTreeNode(
      csc(real(0.5)),
      real(1 / Math.sin(0.5))
    )(
      ['csc(0.5)', 'identified cosecant'],
      ['csc(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['csc(0.5|)', 'processed argument'],
      ['csc(0.5)', 'real cosecant'],
      ['(sin(0.5)^-1)', 'identified exponentiation'],
      ['(|sin(0.5)^-1)', 'processing left operand'],
      ['sin(0.5)', 'identified sine'],
      ['sin(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['sin(0.5|)', 'processed argument'],
      ['sin(0.5)', 'real sine'],
      [w, 'created real'],
      [`(${w}^|-1)`, 'processed left operand; processing right operand'],
      ['-1', 'created real'],
      [`(${w}^-1|)`, 'processed right operand'],
      [`(${w}^-1)`, 'real exponentiation'],
      [v, 'created real']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(csc(complex([1, 2])), complex([0.228375065599, -0.141363021612]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriterTreeNode(
      csc(variable('x')),
      $csc(unit(variable('x').value))[0]
    )(
      ['csc(x)', 'identified cosecant'],
      ['csc(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['csc(x|)', 'processed argument'],
      ['csc(x)', 'created cosecant']
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
    const v = (1 / Math.tan(0.5)).toString()
    const w = Math.tan(0.5).toString()
    expectWriterTreeNode(
      cot(real(0.5)),
      real(1 / Math.tan(0.5))
    )(
      ['cot(0.5)', 'identified cotangent'],
      ['cot(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['cot(0.5|)', 'processed argument'],
      ['cot(0.5)', 'real cotangent'],
      ['(tan(0.5)^-1)', 'identified exponentiation'],
      ['(|tan(0.5)^-1)', 'processing left operand'],
      ['tan(0.5)', 'identified tangent'],
      ['tan(|0.5)', 'processing argument'],
      ['0.5', 'created real'],
      ['tan(0.5|)', 'processed argument'],
      ['tan(0.5)', 'real tangent'],
      [w, 'created real'],
      [`(${w}^|-1)`, 'processed left operand; processing right operand'],
      ['-1', 'created real'],
      [`(${w}^-1|)`, 'processed right operand'],
      [`(${w}^-1)`, 'real exponentiation'],
      [v, 'created real']
    )
  })

  it('returns a complex value when given complex', () => {
    expectCloseTo(cot(complex([1, 2])), complex([0.0327977555337, -0.9843292264581]), 10)
  })

  it('returns a expression when given non-constant', () => {
    expectWriterTreeNode(
      cot(variable('x')),
      $cot(unit(variable('x').value))[0]
    )(
      ['cot(x)', 'identified cotangent'],
      ['cot(|x)', 'processing argument'],
      ['x', 'referenced variable'],
      ['cot(x|)', 'processed argument'],
      ['cot(x)', 'created cotangent']
    )
  })
})
