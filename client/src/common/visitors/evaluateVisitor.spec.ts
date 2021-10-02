import { evaluateVisitor } from "./evaluateVisitor";
import { parser } from "../parser";
import { Node } from 'pegase'

const apply = (input: string) => parser.value(input, {visit: evaluateVisitor})
const num = (val: string) => ({'$label': 'NUMBER', 'value': val})
const variable = (name: string) => ({'$label': 'VARIABLE', 'name': name})

const expectNumber = (input: string, value: number) => {
  const output = apply(input)
  expect(output.$label).toEqual('NUMBER')
  expect(output.evaluated).toEqual(value)
  expect(output.value).toEqual(value.toString())
}

describe('evaluateVisitor', () => {
  it('evaluates numbers but keeps Node structure', () => {
    const input = '1024';
    const output = apply(input)
    expect(typeof output).not.toEqual('number')
    expect(typeof output.evaluated).toEqual('number')
    expect(output.evaluated).toEqual(1024)
  })

  it('does not evaluate variables without context', () => {
    const input = 'x';
    const output = apply(input)
    expect(output.$label).toEqual('VARIABLE')
    expect(output.name).toEqual(input)
    expect(output.evaluated).toBeUndefined()
  })

  describe('without variables', () => {
    it('evaluates binary expressions', () => {
      expectNumber('1 + 2', 3)
      expectNumber('1 - 2', -1)
      expectNumber('2 * 3', 6)
      expectNumber('6 / 2', 3)
    })

    it('evaluates arithmetic with operator precedence', () => {
      expectNumber('1 - 2 * 3', -5)
      expectNumber('2 * 4 + 3 * 5', 23)
    })

    it('evaluates arithmetic with left associativity', () => {
      expectNumber('1 - 2 - 3', -4)
      expectNumber('1 - 2 + 3', 2)
      expectNumber('3 * 4 / 2', 6)
      expectNumber('1024 / 32 / 8', 4)
      expectNumber('1 / 2 * 3', 1.5)
    })

    it('evaluates exponents with right associativity', () => {
      expectNumber('2 ^ 5', 32)
      expectNumber('2 ^ 3 ^ 2', 512)
      expectNumber('2 ^ 2 ^ 3', 256)
    })

    it('evaluates negations', () => {
      expectNumber('-10', -10)
      expectNumber('-(2 * 3)', -6)
      expectNumber('-(-10)', 10)
    })

    // TODO: revisit this once PI is implemented
    it('evaluates trigonometric functions', () => {
      expectNumber('cos(0)', 1)
      expectNumber('sin(0)', 0)
      expectNumber('tan(0)', 0)
    })

    // TODO: revisit this once E is implemented
    // TODO: Implement configuration precision?
    it('evaluates logarithmic functions', () => {
      expectNumber('log(1000)', 3)
      expectNumber('lg(1024)', 10)
      expectNumber('ln(10)', 2.302585092994046)
    })
  })

  describe('with variables but without context', () => {
    it('returns the same node structure', () => {
      const output = apply('1 + x')
      expect(output.$label).toEqual('PLUS')
    })

    it('evaluates numeric sub-expressions', () => {
      const output = apply('(10 / 5) * x')
      expect(output).toMatchObject({
        '$label': 'MULTIPLY',
        a: num('2'),
        b: variable('x')
      })
    })
  })
})