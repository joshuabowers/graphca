import { method, multi, Multi } from '@arrows/multimethod';
import { Multiplication, Base, Real, Complex, Exponentiation } from "./Expression";
import { partial } from "./partial";
import { real } from "./real";
import { complex } from './complex';
import { add } from './addition';
import { raise, reciprocal, square } from "./exponentiation";
import { equals } from './equality';

const swap = <B, T>(f: (l: B, r: B) => T) => (l: B, r: B) => f(r, l)
const not = <T>(type: new(...args: any[]) => T) => (value: unknown) => !(value instanceof type)
const selectLeft = <L, R>(l: L, _r: R) => l
const selectRight = <L, R>(_l: L, r: R) => r

const notAny = <T extends Base>(...types: (new(...args: any[]) => T)[]) => (value: unknown) => types.every((type) => !(value instanceof type))
const any = <T extends Base>(...types: (new(...args: any[]) => T)[]) => (value: unknown) => types.some(type => value instanceof type)

const multiplyReals = (left: Real, right: Real) => real(left.value * right.value)
const multiplyComplexes = (left: Complex, right: Complex) => 
  complex( // 2 + 3i * 3 + 4i => -6 + 17i
    (left.a * right.a) - (left.b * right.b),
    (left.a * right.b) + (left.b * right.a)
  )
const multiplyRC = (left: Real, right: Complex) => complex(left.value * right.a, left.value * right.b)
const otherwise = (left: Base, right: Base) => new Multiplication(left, right)

const isCasR = (v: Base) => v instanceof Complex && v.b === 0
const isPureI = (v: Base) => v instanceof Complex && v.a === 0

// Ea => Exponentiation(a, R)
const isEaxEa = (l: Base, r: Base) =>
  l instanceof Exponentiation && r instanceof Exponentiation
  && equals(l.left, r.left)
const isEaxA = (l: Base, r: Base) =>
  l instanceof Exponentiation && equals(l.left, r)
const isAxEa = (l: Base, r: Base ) =>
  r instanceof Exponentiation && equals(l, r.left)
  
// N => Real | Complex, Nn => N[n]
const isN1_N2A = (l: Base, r: Base) =>
  any<Base>(Real, Complex)(l) && r instanceof Multiplication && any<Base>(Real, Complex)(r.left)

// An => Anything[n]
const isEa_A2xEa = (l: Base, r: Base) =>
  l instanceof Exponentiation && r instanceof Multiplication 
  && r.right instanceof Exponentiation
  && equals(l.left, r.right.left)
const isEa_EaxA2 = (l: Base, r: Base) =>
  l instanceof Exponentiation && r instanceof Multiplication
  && r.left instanceof Exponentiation
  && equals(l.left, r.left.left)
const isA2xEa_Ea = (l: Base, r: Base) =>
  l instanceof Multiplication && r instanceof Exponentiation
  && l.right instanceof Exponentiation
  && equals(l.right.left, r.left)
const isEaxA2_Ea = (l: Base, r: Base) =>
  l instanceof Multiplication && r instanceof Exponentiation
  && l.left instanceof Exponentiation
  && equals(l.left.left, r.left)

const isA1_A2xEa1 = (l: Base, r: Base) =>
  r instanceof Multiplication && r.right instanceof Exponentiation
  && equals(l, r.right.left)
const isA1_Ea1xA2 = (l: Base, r: Base) =>
  r instanceof Multiplication && r.left instanceof Exponentiation
  && equals(l, r.left.left)
const isA2xEa1_A1 = (l: Base, r: Base) =>
  l instanceof Multiplication && l.right instanceof Exponentiation
  && equals(r, l.right.left)
const isEa1xA2_A1 = (l: Base, r: Base) =>
  l instanceof Multiplication && l.left instanceof Exponentiation
  && equals(r, l.left.left)

// isEa1_A1xA2
// isEa1_A2xA1
// isA1xA2_Ea1
// isA2xA1_Ea1

const isA1_A1xA2 = (l: Base, r: Base) =>
  r instanceof Multiplication && equals(l, r.left)
const isA1_A2xA1 = (l: Base, r: Base) =>
  r instanceof Multiplication && equals(l, r.right)
const isA1xA2_A1 = (l: Base, r: Base) =>
  l instanceof Multiplication && equals(l.left, r)
const isA2xA1_A1 = (l: Base, r: Base) =>
  l instanceof Multiplication && equals(l.right, r)

type Multiply = Multi 
  & typeof multiplyReals 
  & typeof multiplyComplexes
  & typeof multiplyRC
  & typeof otherwise

export const multiply: Multiply = multi(
  method([not(Real), Real], (l: Base, r: Real) => multiply(r, l)),
  method([notAny<Base>(Real, Complex), Complex], (l: Base, r: Complex) => multiply(r, l)),
  method([Real, Real], multiplyReals),
  method([Real, Complex], multiplyRC),
  method([isCasR, isCasR], (l: Complex, r: Complex) => complex(l.a * r.a, 0)),
  method([isCasR, isPureI], (l: Complex, r: Complex) => complex(0, l.a * r.b)),
  method([isPureI, isCasR], (l: Complex, r: Complex) => complex(0, l.b * r.a)),
  method([Complex, isCasR], (l: Complex, r: Complex) => complex(l.a * r.a, 0)),
  method([Complex, Complex], multiplyComplexes),
  method([real(0), Base], real(0)),
  method([real(1), Base], selectRight),
  method([real(Infinity), Base], real(Infinity)),
  method([real(-Infinity), Base], real(-Infinity)),
  method(isN1_N2A, (l: Base, r: Multiplication) => multiply(multiply(l, r.left), r.right)),
  method(equals, (l: Base, _r: Base) => square(l)),
  method(isEaxEa, (l: Exponentiation, r: Exponentiation) => raise(l.left, add(l.right, r.right))),
  method(isEaxA, (l: Exponentiation, r: Base) => raise(r, add(l.right, real(1)))),
  method(isAxEa, (l: Base, r: Exponentiation) => raise(l, add(r.right, real(1)))),
  method(isA1_A2xEa1, (l: Base, r: Multiplication) => multiply(r.left, multiply(l, r.right))),
  method(isA1_Ea1xA2, (l: Base, r: Multiplication) => multiply(r.right, multiply(l, r.left))),
  method(isA2xEa1_A1, (l: Multiplication, r: Base) => multiply(l.left, multiply(r, l.right))),
  method(isEa1xA2_A1, (l: Multiplication, r: Base) => multiply(l.right, multiply(r, l.left))),
  method(isEa_A2xEa, (l: Exponentiation, r: Multiplication) => multiply(r.left, multiply(l, r.right))),
  method(isEa_EaxA2, (l: Exponentiation, r: Multiplication) => multiply(r.right, multiply(l, r.left))),
  method(isA2xEa_Ea, (l: Multiplication, r: Exponentiation) => multiply(l.left, multiply(l.right, r))),
  method(isEaxA2_Ea, (l: Multiplication, r: Exponentiation) => multiply(l.right, multiply(l.left, r))),
  method(isA1_A1xA2, (l: Base, r: Multiplication) => multiply(r.right, multiply(l, r.left))),
  method(isA1_A2xA1, (l: Base, r: Multiplication) => multiply(r.left, multiply(l, r.right))),
  method(isA1xA2_A1, (l: Multiplication, r: Base) => multiply(l.right, multiply(l.left, r))),
  method(isA2xA1_A1, (l: Multiplication, r: Base) => multiply(l.left, multiply(l.right, r))),
  method([Base, Base], otherwise)
)

export const negate = partial(multiply, real(-1))
export const double = partial(multiply, real(2))

// Defined as a multimethod to propagate type information.
export const divide: Multiply = multi(
  method([Base, Base], (l: Base, r: Base) => multiply(l, reciprocal(r)))
)
