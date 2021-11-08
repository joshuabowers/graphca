import { Unicode } from "./MathSymbols";
import { parser } from "./parser";
import { 
  NodeLike,
  num, real, variable,
  add, subtract, multiply, divide, raise, negate,
  cos, sin, tan,
  acos, asin, atan,
  cosh, sinh, tanh,
  acosh, asinh, atanh,
  lg,
  gamma, factorial, abs,
  assign, invoke
} from './visitors/helpers/NodeLike'

const expectObject = (input: string, expected: NodeLike) => {
  let output = undefined
  expect(() => {output = parser.value(input)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

// Helper functions for generating tree nodes to check.
// const num = (val: string) => ({'$label': 'NUMBER', 'value': val})

describe('parser', () => {
  it('can parse a new expression after a failure', () => {
    expect(() => parser.value('2 @ 3')).toThrow()
    expect(() => parser.value('2 + 3')).not.toThrow()
  })

  it('matches numbers', () => {
    const inputs = '1 10 0 0.25 10.25 1.23E4 1.23E-4'.split(' ');
    inputs.forEach(input => {
      expect(parser.parse(input).logger.toString()).toEqual('')
      expect(parser.value(input)).toMatchObject(num(input))
    })
  })

  it('matches a decimal without leading 0', () => {
    const input = '.25'
    expect(parser.value(input)).toMatchObject(num(input))
  })

  it('matches a lengthy number', () => {
    const input = '1024.01234E-123'
    expect(parser.value(input)).toMatchObject(num(input))
  })

  it('matches i', () => {
    const input = Unicode.i
    expect(parser.value(input)).toMatchObject({'$label': 'I'})
  })

  it('matches multiples of i', () => {
    const input = `2.5${Unicode.i}`
    expect(parser.value(input)).toMatchObject({
      '$label': 'I',
      'value': '2.5'
    })
  })

  it('matches e', () => {
    const input = Unicode.e
    expect(parser.value(input)).toMatchObject({'$label': 'E'})
  })

  it('matches pi', () => {
    const input = Unicode.pi
    expect(parser.value(input)).toMatchObject({'$label': 'PI'})
  })

  it('matches infinity', () => {
    const input = Unicode.infinity
    expect(parser.value(input)).toMatchObject({'$label': 'INFINITY'})
  })

  it('matches epsilon', () => {
    const input = Unicode.epsilon
    expect(parser.value(input)).toMatchObject({$label: 'EPSILON'})
  })

  it('matches variables', () => {
    const variables = ['x', 'zed', 'y10']
    variables.forEach(v => {
      expect(parser.test(v)).toBeTruthy()
      expect(parser.value(v)).toMatchObject(variable(v))
    })
    expect(parser.test('10x')).toBeFalsy()
    expect(parser.test('tan1')).toBeFalsy()
  })

  it('matches basic arithmetic', () => {
    expectObject('x + 1', add(variable('x'), num(1)))
    expectObject('1 + x * 2', add(
      num(1), multiply(variable('x'), num(2))
    ))
  })

  it('associates the minus operator to the left', () => {
    expectObject('7 - 2 - 4', subtract(
      subtract(num(7), num(2)),
      num(4)
    ))
  })

  it('handles operator precedence and associativity', () => {
    expectObject('1 + 2 * 3 - 4 / n', subtract(
      add(
        num(1),
        multiply(num(2), num(3))
      ),
      divide(num(4), variable('n'))
    ))
  })

  it('matches a function call', () => {
    expectObject('cos(x)', cos(variable('x')))
  })

  it('matches functional expressions', () => {
    expectObject('cos(lg(1024*x))', cos(
      lg(
        multiply(num(1024), variable('x'))
      )
    ))
  })

  it('matches functional expressions in arithmetic', () => {
    expectObject('1 + 2 * cos(x)', add(
      num(1),
      multiply(
        num(2), cos(variable('x'))
      )
    ))
  })

  it('matches trigonometric functions', () => {
    expectObject('cos(x)', cos(variable('x')))
    expectObject('sin(x)', sin(variable('x')))
    expectObject('tan(x)', tan(variable('x')))
  })

  it('matches arcus functions', () => {
    expectObject('acos(x)', acos(variable('x')))
    expectObject('asin(x)', asin(variable('x')))
    expectObject('atan(x)', atan(variable('x')))
  })

  it('matches hyperbolic functions', () => {
    expectObject('cosh(x)', cosh(variable('x')))
    expectObject('sinh(x)', sinh(variable('x')))
    expectObject('tanh(x)', tanh(variable('x')))
  })

  it('matches area hyperbolic functions', () => {
    expectObject('acosh(x)', acosh(variable('x')))
    expectObject('asinh(x)', asinh(variable('x')))
    expectObject('atanh(x)', atanh(variable('x')))
  })

  it('matches negations', () => {
    expectObject('-1', negate(num(1)))
    expectObject('-(x - 1)', negate(
      subtract(variable('x'), num(1))
    ))
  })

  it('matches gamma', () => {
    expectObject(`${Unicode.gamma}(x)`, gamma(variable('x')))
  })

  it('matches exponents', () => {
    expectObject('(-x)^2', raise(
      negate(variable('x')), num(2)
    ))
  })

  it('has the proper associativity for exponents', () => {
    expectObject('x^2+5', add(
      raise(variable('x'), num(2)),
      num(5)
    ))
  })

  it('matches factorials', () => {
    expectObject('n!', factorial(variable('n')))
  })

  it('matches absolute values', () => {
    expectObject('abs(x)', abs(variable('x')))
  })

  it('matches assignment statements', () => {
    expectObject('x <- 5 + 2', assign(
      'x', add(num(5), num(2))
    ))
  })

  it('matches variable invocations', () => {
    expectObject('x(1, 2)', invoke(
      'x', [num(1), num(2)]
    ))
  })
})