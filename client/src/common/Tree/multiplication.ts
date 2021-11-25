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
// isN1_N2xA

// An => Anything[n]
// isEa_A2xEa
// isEa_EaxA2
// isA2xEa_Ea
// isEaxA2_Ea

// isA1_A1xA2
// isA1_A2xA1
// isA1xA2_A1
// isA2xA2_A1

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
  method(equals, (l: Base, _r: Base) => square(l)),
  method(isEaxEa, (l: Exponentiation, r: Exponentiation) => raise(l.left, add(l.right, r.right))),
  method(isEaxA, (l: Exponentiation, r: Base) => raise(r, add(l.right, real(1)))),
  method(isAxEa, (l: Base, r: Exponentiation) => raise(l, add(r.right, real(1)))),
  method([Base, Base], otherwise)
)

export const negate = partial(multiply, real(-1))
export const double = partial(multiply, real(2))

// Defined as a multimethod to propagate type information.
export const divide: Multiply = multi(
  method([Base, Base], (l: Base, r: Base) => multiply(l, reciprocal(r)))
)
