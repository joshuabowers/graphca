import { parameterVisitor } from "./parameterVisitor";
import { parser } from "../parser";
import { applyVisitor } from "pegase";

const apply = (input: string) => {
  const result = parser.parse(input)
  if(result.success){
    return applyVisitor(result.value, parameterVisitor, result.options)
  }
}

describe('parameterVisitor', () => {
  it('yields the name of variable nodes', () => {
    expect(apply('x')).toEqual(['x'])
  })

  it('yields nothing for numbers', () => {
    expect(apply('10')).toEqual([])
  })

  it('yields variables in binary operations', () => {
    expect(apply('1 + x')).toEqual(['x'])
    expect(apply('1 - x')).toEqual(['x'])
    expect(apply('1 * x')).toEqual(['x'])
    expect(apply('1 / x')).toEqual(['x'])
    expect(apply('1 ^ x')).toEqual(['x'])
  })

  it('yields variables in unary operations', () => {
    expect(apply('-x')).toEqual(['x'])
    expect(apply('x!')).toEqual(['x'])
    expect(apply('cos(x)')).toEqual(['x'])
    expect(apply('sin(x)')).toEqual(['x'])
    expect(apply('tan(x)')).toEqual(['x'])
    expect(apply('cosh(x)')).toEqual(['x'])
    expect(apply('sinh(x)')).toEqual(['x'])
    expect(apply('tanh(x)')).toEqual(['x'])
    expect(apply('acos(x)')).toEqual(['x'])
    expect(apply('asin(x)')).toEqual(['x'])
    expect(apply('atan(x)')).toEqual(['x'])
    expect(apply('acosh(x)')).toEqual(['x'])
    expect(apply('asinh(x)')).toEqual(['x'])
    expect(apply('atanh(x)')).toEqual(['x'])
    expect(apply('lb(x)')).toEqual(['x'])
    expect(apply('ln(x)')).toEqual(['x'])
    expect(apply('lg(x)')).toEqual(['x'])
  })

  it('yields multiple variables in appearance order', () => {
    expect(apply('x + y * cos(z)')).toEqual(['x', 'y', 'z'])
    expect(apply('cos(z) * y + x')).toEqual(['z', 'y', 'x'])
  })
})