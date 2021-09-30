import { parser } from "./parser";

// Helper functions for generating tree nodes to check.
const num = (val: string) => ({'$label': 'NUMBER', 'value': val})
const variable = (name: string) => ({'$label': 'VARIABLE', 'name': name})

describe('parser', () => {
  it('matches numbers', () => {
    const inputs = '1 10 0 0.25 10.25 1.23E4 1.23E-4'.split(' ');
    inputs.forEach(input => {
      expect(parser.parse(input).logger.print()).toEqual('')
      expect(parser.value(input)).toMatchObject(num(input))
    })
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

  it('handles operator precedence and associativity', () => {
    expect(parser.value('1 + 2 * 3 - 4 / n')).toMatchObject({
      '$label': 'PLUS',
      'a': num('1'),
      'b': {
        '$label': 'MINUS',
        'a': {
          '$label': 'MULTIPLY',
          'a': num('2'),
          'b': num('3')
        },
        'b': {
          '$label': 'DIVIDE',
          'a': num('4'),
          'b': variable('n')
        }
      }
    })
  })

  it('matches a function call', () => {
    expect(parser.value('cos(x)')).toMatchObject({
      '$label': 'COS',
      'args': variable('x')
    })
  })

  it('matches functional expressions', () => {
    expect(parser.value('cos(lg(1024*x))')).toMatchObject({
      '$label': 'COS',
      'args': {
        '$label': 'LG',
        'args': {
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
          'args': variable('x')
        }
      }
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
      'base': {
        '$label': 'NEGATE',
        'expression': variable('x')
      },
      'power': num('2')
    })
  })
})