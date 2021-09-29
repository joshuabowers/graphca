import { parser } from "./parser";

describe('parser', () => {
  it('matches numbers', () => {
    const inputs = '1 10 0 0.25 10.25 1.23E4 1.23E-4'.split(' ');
    inputs.forEach(input => {
      expect(parser.parse(input).logger.print()).toEqual('')
      expect(parser.children(input)).toEqual([input])
    })
  })

  it('matches variables', () => {
    expect(parser.test('x')).toBeTruthy()
    expect(parser.test('zed')).toBeTruthy()
    expect(parser.children('x')).toEqual(['x'])
    expect(parser.children('zed')).toEqual(['zed'])
  })

  it('matches basic arithmetic', () => {
    expect(parser.test('x + 1')).toBeTruthy()
    expect(parser.children('x + 1')).toEqual(['x', '+', '1'])
    // TODO: Revisit
    expect(parser.children('1 + x * 2')).toEqual(['1', '+', 'x', '*', '2'])
  })

  it('matches functional expressions', () => {
    expect(parser.children('cos(lg(1024*x))')).toEqual(['cos', 'lg', '1024', '*', 'x'])
  })
})