import { Unicode } from "./MathSymbols";
import { parser } from "./parser";

// Helper functions for generating tree nodes to check.
const num = (val: string) => ({'$label': 'NUMBER', 'value': val})
const variable = (name: string) => ({'$label': 'VARIABLE', 'name': name})

describe('parser', () => {
  it('can parse a new expression after a failure', () => {
    expect(() => parser.value('2 @ 3')).toThrow()
    expect(() => parser.value('2 + 3')).not.toThrow()
  })

  it('matches numbers', () => {
    const inputs = '1 10 0 0.25 10.25 1.23E4 1.23E-4'.split(' ');
    inputs.forEach(input => {
      expect(parser.parse(input).log()).toEqual('')
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
    expect(parser.value('x + 1')).toMatchObject({
      '$label': 'PLUS', 
      'a': variable('x'), 
      'b': num('1')
    })
    expect(parser.value('1 + x * 2')).toMatchObject({
      '$label': 'PLUS',
      'a': num('1'),
      'b': {
        '$label': 'MULTIPLY',
        'a': variable('x'),
        'b': num('2')
      }
    })
  })

  it('associates the minus operator to the left', () => {
    expect(parser.value('7 - 2 - 4')).toMatchObject({
      '$label': 'MINUS',
      'a': {
        '$label': 'MINUS',
        'a': num('7'),
        'b': num('2')
      },
      'b': num('4')
    })
  })

  it('handles operator precedence and associativity', () => {
    expect(parser.value('1 + 2 * 3 - 4 / n')).toMatchObject({
      '$label': 'MINUS',
      'a': {
        '$label': 'PLUS',
        'a': num('1'),
        'b': {
          '$label': 'MULTIPLY',
          'a': num('2'),
          'b': num('3')
        }
      },
      'b': {
        '$label': 'DIVIDE',
        'a': num('4'),
        'b': variable('n')
      }
    })
  })

  it('matches a function call', () => {
    expect(parser.value('cos(x)')).toMatchObject({
      '$label': 'COS',
      'expression': variable('x')
    })
  })

  it('matches functional expressions', () => {
    expect(parser.value('cos(lg(1024*x))')).toMatchObject({
      '$label': 'COS',
      'expression': {
        '$label': 'LG',
        'expression': {
          '$label': 'MULTIPLY',
          'a': num('1024'),
          'b': variable('x')
        }
      }
    })
  })

  it('matches functional expressions in arithmetic', () => {
    expect(parser.value('1 + 2 * cos(x)')).toMatchObject({
      '$label': 'PLUS',
      'a': num('1'),
      'b': {
        '$label': 'MULTIPLY',
        'a': num('2'),
        'b': {
          '$label': 'COS',
          'expression': variable('x')
        }
      }
    })
  })

  it('matches arcus functions', () => {
    expect(parser.value('acos(x)')).toMatchObject({
      '$label': 'ACOS',
      'expression': variable('x')
    })
    expect(parser.value('asin(x)')).toMatchObject({
      '$label': 'ASIN',
      'expression': variable('x')
    })
    expect(parser.value('atan(x)')).toMatchObject({
      '$label': 'ATAN',
      'expression': variable('x')
    })
  })

  it('matches negations', () => {
    expect(parser.value('-1')).toMatchObject({
      '$label': 'NEGATE',
      'expression': num('1')
    })
    expect(parser.value('-(x - 1)')).toMatchObject({
      '$label': 'NEGATE',
      'expression': {
        '$label': 'MINUS',
        'a': variable('x'),
        'b': num('1')
      }
    })
  })

  it('matches exponents', () => {
    expect(parser.value('(-x)^2')).toMatchObject({
      '$label': 'EXPONENT',
      'a': {
        '$label': 'NEGATE',
        'expression': variable('x')
      },
      'b': num('2')
    })
  })

  it('matches factorials', () => {
    expect(parser.value('n!')).toMatchObject({
      '$label': 'FACTORIAL',
      'expression': variable('n')
    })
  })
})