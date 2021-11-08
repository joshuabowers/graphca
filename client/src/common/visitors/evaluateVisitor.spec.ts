import { evaluateVisitor } from "./evaluateVisitor";
import { parser } from "../parser";
import { Node } from 'pegase'
import { Unicode } from "../MathSymbols";
import { Field } from "../fields/Field";
import { Complex } from "../fields/Complex";
import { Real } from "../fields/Real";
import { Scope } from "../Scope";

const apply = (input: string, context?: Scope) => parser.value(input, {visit: evaluateVisitor, context})
const real = (val: string) => ({'$label': 'REAL', 'value': new Real(val)})
const complex = (val: string) => ({'$label': 'COMPLEX', 'value': val})
const variable = (name: string) => ({'$label': 'VARIABLE', 'name': name})

type Transform<T extends Field<T>> = (value: T) => number

const expectField = <T extends Field<T>>(input: string, label: string, expected: T, precision: number, ...transforms: Transform<T>[]) => {
  const output = apply(input)
  expect(output.$label).toEqual(label)
  transforms.forEach(transform => {
    const e = transform(expected), a = transform(output.value)
    if(Number.isNaN(e)) {
      expect(a).toEqual(e)
    } else {
      expect(a).toBeCloseTo(e, precision)
    }
  })
}

const expectReal = (input: string, value: Real, precision: number = 17) => {
  expectField(input, 'REAL', value, precision, real => real.value)
}

const expectComplex = (input: string, value: Complex, precision: number = 17) => {
  expectField(input, 'COMPLEX', value, precision, complex => complex.a, complex => complex.b)
}

describe('evaluateVisitor', () => {
  it('evaluates numbers but keeps Node structure', () => {
    expectReal('1024', new Real(1024))
  })

  it('does not evaluate variables without context', () => {
    const input = 'x';
    const output = apply(input)
    expect(output.$label).toEqual('VARIABLE')
    expect(output.name).toEqual(input)
    expect(output.evaluated).toBeUndefined()
  })

  describe('without variables', () => {
    it('approximates e', () => {
      expectReal(Unicode.e, Real.E)
    })

    it('represents i as a complex', () => {
      expectComplex(Unicode.i, new Complex(0, 1))
    })

    it('handles a zero imaginary as a complex', () => {
      expectComplex(`0${Unicode.i}`, new Complex(0, 0))
    })

    it('approximates pi', () => {
      expectReal(Unicode.pi, Real.PI)
    })

    it('has a value for epsilon', () => {
      expectReal(Unicode.epsilon, Real.Epsilon)
    })

    it('contemplates infinity', () => {
      expectReal(Unicode.infinity, Real.Infinity)
    })

    it('evaluates binary expressions', () => {
      expectReal('1 + 2', new Real(3))
      expectReal('1 - 2', new Real(-1))
      expectReal('2 * 3', new Real(6))
      expectReal('6 / 2', new Real(3))
    })

    it('computes negative infinity', () => {
      expectReal('(-5) / 0', new Real(-Infinity))
    })

    it('evaluates arithmetic with operator precedence', () => {
      expectReal('1 - 2 * 3', new Real(-5))
      expectReal('2 * 4 + 3 * 5', new Real(23))
    })

    it('evaluates arithmetic with left associativity', () => {
      expectReal('1 - 2 - 3', new Real(-4))
      expectReal('1 - 2 + 3', new Real(2))
      expectReal('3 * 4 / 2', new Real(6))
      expectReal('1024 / 32 / 8', new Real(4))
      expectReal('1 / 2 * 3', new Real(1.5))
    })

    it('evaluates exponents with right associativity', () => {
      expectReal('2 ^ 5', new Real(32))
      expectReal('2 ^ 3 ^ 2', new Real(512))
      expectReal('2 ^ 2 ^ 3', new Real(256))
    })

    it('converts a negative real to a complex when it is raised', () => {
      expectComplex('(-1)^2', new Complex(1), 10)
      expectComplex('(-1)^0.5', new Complex(0, 1), 10)
      expectComplex('(-25)^0.5', new Complex(0, 5), 10)
    })

    it('evaluates negations', () => {
      expectReal('-10', new Real(-10))
      expectReal('-(2 * 3)', new Real(-6))
      expectReal('-(-10)', new Real(10))
    })

    // TODO: revisit this once PI is implemented
    it('evaluates trigonometric functions', () => {
      expectReal('cos(0)', new Real(1))
      expectReal('sin(0)', new Real(0))
      expectReal('tan(0)', new Real(0))
    })

    it('evaluates arcus functions', () => {
      expectReal('acos(0)', new Real(Math.PI / 2))
      expectReal('asin(0)', new Real(0))
      expectReal('atan(0)', new Real(0))
    })

    it('evaluates hyperbolic functions', () => {
      expectReal('cosh(0)', new Real(1))
      expectReal('sinh(0)', new Real(0))
      expectReal('tanh(0)', new Real(0))
    })

    it('evaluates area hyperbolic functions', () => {
      expectReal('acosh(0)', Real.NaN)
      expectReal('asinh(0)', new Real(0))
      expectReal('atanh(0)', new Real(0))
    })

    // TODO: revisit this once E is implemented
    // TODO: Implement configuration precision?
    it('evaluates logarithmic functions', () => {
      expectReal('lg(1000)', new Real(3))
      expectReal('lb(1024)', new Real(10))
      expectReal('ln(10)', new Real(2.302585092994046))
    })

    it('evaluates factorials', () => {
      expectReal('5!', new Real(120))
    })

    it('fails to evaluate a negative number factorial', () => {
      expectReal('(-5)!', Real.NaN)
    })

    it('casts reals to complexes for mixed binary ops', () => {
      expectComplex(`2 + 3${Unicode.i}`, new Complex(2, 3))
    })

    it('computes the gamma function for integers', () => {
      expectReal(`${Unicode.gamma}(5)`, new Real(24), 10)
    })

    it('computes the gamma function for reals', () => {
      expectReal(`${Unicode.gamma}(5.5)`, new Real(52.34277778455362))
    })

    it('computes the gamma function for complexes', () => {
      expectComplex(`${Unicode.gamma}(1 - ${Unicode.i})`, new Complex(0.49801566811835646, 0.15494982830181053))
    })

    it('computes the absolute value for reals', () => {
      expectReal('abs(5)', new Real(5))
      expectReal('abs(-5)', new Real(5))
    })

    it('computes the absolute value of infinity', () => {
      expectReal(`abs(-${Unicode.infinity})`, Real.Infinity)
    })

    it('computes the absolute value of complexes', () => {
      expectComplex(`abs(2 + 3${Unicode.i})`, new Complex(3.6055512754639896))
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
        a: real('2'),
        b: variable('x')
      })
    })

    it('throws an error if no scope given on assignment', () => {
      expect(() => apply('x <- 5')).toThrow()
    })
  })

  describe('with context', () => {
    it('assigns variables in the context object', () => {
      const s = new Scope()
      const output = apply('x <- 5', s)
      expect(s.has('x'))
      expect(s.get('x')).toMatchObject(real('5'))
      expect(output).toMatchObject(real('5'))
    })

    it('evaluates the value of an expression before assigning', () => {
      const s = new Scope()
      const output = apply('x <- 2^3', s)
      expect(s.get('x')).toMatchObject(real('8'))
      expect(output).toMatchObject(real('8'))
    })

    it('returns the value of a variable as the value of the assignment', () => {
      const s = new Scope()
      const output = apply('x <- 5', s)
      expect(s.get('x')).toMatchObject(output)
      expect(output).not.toBeUndefined()
    })

    it('assigns expressions with valueless variables to variables', () => {
      const s = new Scope()
      apply('y <- x + 5', s)
      expect(s.get('x')).toBeUndefined()
      expect(s.get('y')).toMatchObject({
        $label: 'PLUS',
        'a': variable('x'),
        'b': real('5')
      })
    })

    it('evaluates variables when assigning to variables', () => {
      const s = new Scope()
      apply('x <- 2^10', s)
      apply('y <- x * 4', s)
      expect(s.get('x')).toMatchObject(real('1024'))
      expect(s.get('y')).toMatchObject(real('4096'))
    })

    it('returns the value of a variable when referenced', () => {
      const s = new Scope()
      apply('x <- 10', s)
      const output = apply('x + 1', s)
      expect(output).toMatchObject(real('11'))
    })

    it('returns an unevaluated variable if assigned to itself', () => {
      const s = new Scope()
      expect(() => apply('x <- x', s)).not.toThrow()
      const output = apply('x(1)', s)
      expect(output).toMatchObject(real('1'))
    })

    it('evaluates a variable in the current context when referenced', () => {
      const s = new Scope()
      apply('y <- x * 5', s)
      apply('x <- 10', s)
      expect(s.get('x')).toMatchObject(real('10'))
      expect(s.get('y')).toMatchObject({
        $label: 'MULTIPLY',
        'a': variable('x'),
        'b': real('5')
      })
      const output = apply('y', s)
      expect(output).toMatchObject(real('50'))
    })

    it('stops evaluation if function undefined', () => {
      const s = new Scope()
      const output = apply('x(2^3)', s)
      expect(s.get('x')).toBeUndefined()
      expect(output).toMatchObject({
        $label: 'INVOKE',
        'identifier': 'x',
        'argumentList': [{$label: 'EXPONENT', 'a': {'value': '2'}, 'b': {'value': '3'}}]
      })
    })

    it('temporarily sets context when invoking a variable', () => {
      const s = new Scope()
      apply('y <- x * 5', s)
      const output = apply('y(10)', s)
      expect(s.get('x')).toBeUndefined()
      expect(s.get('y')).toMatchObject({
        $label: 'MULTIPLY',
        'a': variable('x'),
        'b': real('5')
      })
      expect(output).toMatchObject(real('50'))
    })

    it('partially sets context if not enough arguments are supplied', () => {
      const s = new Scope()
      apply('f <- x * y', s)
      const output = apply('f(10)', s)
      expect(s.get('x')).toBeUndefined()
      expect(s.get('y')).toBeUndefined()
      expect(s.get('f')).toMatchObject({
        $label: 'MULTIPLY',
        'a': variable('x'),
        'b': variable('y')
      })
      expect(output).toMatchObject({
        $label: 'MULTIPLY',
        'a': real('10'),
        'b': variable('y')
      })
    })

    it('handles multiple arguments correctly', () => {
      const s = new Scope()
      apply('f <- x * y', s)
      const output = apply('f(10, 5)', s)
      expect(output).toMatchObject(real('50'))
    })

    it('ignores an excess of arguments', () => {
      const s = new Scope()
      apply('f <- x * y', s)
      const output = apply('f(10, 5, 2)', s)
      expect(output).toMatchObject(real('50'))
    })

    it('evaluates the arguments before evaluating the variable', () => {
      const s = new Scope()
      apply('f <- x * y', s)
      const output = apply('f(2^3, 2^4)', s)
      expect(output).toMatchObject(real('128'))
    })

    it('handles variables passed as argument', () => {
      const s = new Scope()
      apply('f <- lb(x)', s)
      apply('y <- 2 ^ 10', s)
      const output = apply('f(y)', s)
      expect(output).toMatchObject(real('10'))
    })

    it('handles undefined variables as argument', () => {
      const s = new Scope()
      apply('f <- x + x', s)
      expect(s.get('x')).toBeUndefined()
      expect(s.get('f')).toMatchObject({
        $label: 'PLUS',
        'a': variable('x'),
        'b': variable('x')
      })
      const output = apply('f(x)', s)
      expect(output).toMatchObject({
        $label: 'PLUS',
        'a': variable('x'),
        'b': variable('x')
      })
    })

    it('replaces variables with functional composition', () => {
      const s = new Scope()
      apply('f <- x * 5', s)
      expect(s.get('f')).toMatchObject({
        $label: 'MULTIPLY',
        'a': variable('x'),
        'b': real('5')
      })

      apply('g <- f(y)', s)
      expect(s.get('x')).toBeUndefined()
      expect(s.get('y')).toBeUndefined()
      expect(s.get('g')).toMatchObject({
        $label: 'MULTIPLY',
        'a': variable('y'),
        'b': real('5')
      })
    })

    it('handles functional composition', () => {
      const s = new Scope()
      apply('f <- 2 * x', s)
      apply('g <- f(x) * 3', s)
      apply('h <- g(x)', s)
      expect(s.get('h')).toMatchObject({
        $label: 'MULTIPLY',
        'a': {
          $label: 'MULTIPLY',
          'a': real('2'),
          'b': variable('x')
        },
        'b': real('3')
      })
      const output = apply('h(g(5))', s)
      expect(output).toMatchObject(real('180'))
    })
  })
})