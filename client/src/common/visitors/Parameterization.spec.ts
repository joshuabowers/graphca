import { treeParser } from "../treeParser";
import { Parameterization } from "./Parameterization";

const parameterize = (input: string) => {
  const parameterization = new Parameterization()
  return treeParser.value(input).accept(parameterization)
}

const setOfX = new Set('x')

describe(Parameterization, () => {
  it('yields the name of variable nodes', () => {
    expect(parameterize('x')).toEqual(setOfX)
  })

  it('yields nothing for numbers', () => {
    expect(parameterize('10')).toEqual(new Set())
  })

  it('yields variables in binary operations', () => {
    expect(parameterize('1 + x')).toEqual(setOfX)
    expect(parameterize('1 - x')).toEqual(setOfX)
    expect(parameterize('1 * x')).toEqual(setOfX)
    expect(parameterize('1 / x')).toEqual(setOfX)
    expect(parameterize('1 ^ x')).toEqual(setOfX)
  })

  it('yields variables in unary operations', () => {
    expect(parameterize('-x')).toEqual(setOfX)
    expect(parameterize('x!')).toEqual(setOfX)
    expect(parameterize('cos(x)')).toEqual(setOfX)
    expect(parameterize('sin(x)')).toEqual(setOfX)
    expect(parameterize('tan(x)')).toEqual(setOfX)
    expect(parameterize('cosh(x)')).toEqual(setOfX)
    expect(parameterize('sinh(x)')).toEqual(setOfX)
    expect(parameterize('tanh(x)')).toEqual(setOfX)
    expect(parameterize('acos(x)')).toEqual(setOfX)
    expect(parameterize('asin(x)')).toEqual(setOfX)
    expect(parameterize('atan(x)')).toEqual(setOfX)
    expect(parameterize('acosh(x)')).toEqual(setOfX)
    expect(parameterize('asinh(x)')).toEqual(setOfX)
    expect(parameterize('atanh(x)')).toEqual(setOfX)
    expect(parameterize('lb(x)')).toEqual(setOfX)
    expect(parameterize('ln(x)')).toEqual(setOfX)
    expect(parameterize('lg(x)')).toEqual(setOfX)
  })

  it('yields multiple variables in appearance order', () => {
    expect(parameterize('x + y * cos(z)')).toEqual(new Set(['x', 'y', 'z']))
    expect(parameterize('cos(z) * y + x')).toEqual(new Set(['z', 'y', 'x']))
  })

  it('only yields one instance of a variable', () => {
    expect(parameterize('x^2 + 2 * x + y')).toEqual(new Set(['x', 'y']))
  })
})