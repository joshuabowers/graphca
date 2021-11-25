import { method, multi, Multi } from '@arrows/multimethod';
import { Binary, Multiplication, Base, Real, Complex, Exponentiation } from "./Expression";
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
  
// N => Real | Complex, Nn => N[n]
const isN1_N2A = (l: Base, r: Base) =>
  any<Base>(Real, Complex)(l) && r instanceof Multiplication && any<Base>(Real, Complex)(r.left)

const identity = <T>(t: T) => t
const leftBranch = <T extends Binary>(t: T) => t.left
const rightBranch = <T extends Binary>(t: T) => t.right

type Which<T> = (t: T) => Base
const equivalent = (a: Which<Multiplication>, b: Which<Multiplication>) =>
  (left: Multiplication, right: Multiplication) => canFormExponential(a(left), b(right))

type Transform = (left: Multiplication, right: Multiplication) => Base
const flip: Transform = (l, r) => collectFromProducts(r, l)

type CollectFromProductsFn = Multi & Transform

export const collectFromProducts: CollectFromProductsFn = multi(
  method(equivalent(identity, identity), <Transform>((l, r) => square(l))),
  method(equivalent(leftBranch, leftBranch), <Transform>((l, r) => 
    multiply(
      multiply(l.left, r.left),
      multiply(l.right, r.right)
    )
  )),
  method(equivalent(leftBranch, rightBranch), <Transform>((l, r) =>
    multiply(
      multiply(l.left, r.right),
      multiply(l.right, r.left)
    )
  )),
  method(equivalent(identity, leftBranch), <Transform>((l, r) =>
    multiply(square(l), r.right)
  )),
  method(equivalent(identity, rightBranch), <Transform>((l, r) =>
    multiply(square(l), r.left)
  )),
  method(equivalent(rightBranch, leftBranch), flip),
  method(equivalent(rightBranch, rightBranch), flip),
  method(equivalent(leftBranch, identity), flip),
  method(equivalent(rightBranch, identity), flip)
)

export type CanFormExponentialFn = Multi
  & ((left: Multiplication, right: Multiplication) => boolean)
  & ((left: Base, right: Multiplication) => boolean)
  & ((left: Multiplication, right: Base) => boolean)
  & ((left: Base, right: Exponentiation) => boolean)
  & ((left: Exponentiation, right: Base) => boolean)
  & ((left: Exponentiation, right: Multiplication) => boolean)
  & ((left: Multiplication, right: Exponentiation) => boolean)
  & ((left: Exponentiation, right: Exponentiation) => boolean)
  & ((left: Base, right: Base) => boolean)

export const canFormExponential: CanFormExponentialFn = multi(
  method(
    [Multiplication, Multiplication], (l: Multiplication, r: Multiplication) =>
      canFormExponential(l, r)
      || canFormExponential(l.left, r.left)
      || canFormExponential(l.left, r.right)
      || canFormExponential(l.right, r.left)
      || canFormExponential(l.right, r.right)
      || canFormExponential(l.left, r)
      || canFormExponential(l.right, r)
      || canFormExponential(l, r.left)
      || canFormExponential(l, r.right)
  ),
  method(
    [Base, Multiplication], (l: Base, r: Multiplication) => 
      canFormExponential(l, r.left) || canFormExponential(l, r.right)
  ),
  method([Multiplication, Base], (l: Base, r: Base) => canFormExponential(r, l)),
  method([Exponentiation, Exponentiation], (l: Exponentiation, r: Exponentiation) => equals(l.left, r.left)),
  method(
    [Base, Exponentiation], (l: Base, r: Exponentiation) => 
      canFormExponential(l, r.left)
  ),
  method([Exponentiation, Base], (l: Base, r: Base) => canFormExponential(r, l)),
  method(
    [Exponentiation, Multiplication], (l: Exponentiation, r: Multiplication) =>
      canFormExponential(l, r.left) 
      || canFormExponential(l, r.right)
      || canFormExponential(l.left, r.left) 
      || canFormExponential(l.left, r.right)
  ),
  method([Multiplication, Exponentiation], (l: Base, r: Base) => canFormExponential(r, l)),
  method(equals)
)

export type ExponentialCollectFn = Multi
  & ((left: Multiplication, right: Multiplication) => Base)
  & ((left: Base, right: Multiplication) => Base)
  & ((left: Multiplication, right: Base) => Base)
  & ((left: Base, right: Exponentiation) => Base)
  & ((left: Exponentiation, right: Base) => Base)
  & ((left: Exponentiation, right: Exponentiation) => Base)
  & ((left: Base, right: Base) => Base)

export const exponentialCollect: ExponentialCollectFn = multi(
  method(
    [Multiplication, Multiplication],
    (l: Multiplication, r: Multiplication) => collectFromProducts
  ),
  method(
    [Base, Multiplication], 
    (l: Base, r: Multiplication, isLeft = canFormExponential(l, r.left)) =>
      multiply(
        isLeft ? r.right : r.left, 
        exponentialCollect(l, isLeft ? r.left : r.right)
      )
  ),
  method([Multiplication, Base], (l: Base, r: Base) => exponentialCollect(r, l)),
  method(
    [Exponentiation, Exponentiation], (l: Exponentiation, r: Exponentiation) => 
      raise(l.left, add(l.right, r.right))
  ),
  method([Base, Exponentiation], (l: Base, r: Exponentiation) => raise(l, add(r.right, real(1)))),
  method([Exponentiation, Base], (l: Base, r: Base) => exponentialCollect(r, l)),
  method([Base, Base], (l: Base, _r: Base) => square(l))
)

type Multiply = Multi 
  & typeof multiplyReals 
  & typeof multiplyComplexes
  & typeof multiplyRC
  & typeof otherwise

// Potential for simplification:
// No enforced order currently exists for terms, other
// than constants get bubbled left. So, use degree to order the
// results. This will not guarantee that a given node kind will
// always exist in a given position:
// (x^5 * y^3) * z^15, but z^2 * (x^5 * y^3)

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
  method(canFormExponential, exponentialCollect),
  method([Base, Base], otherwise)
)

export const negate = partial(multiply, real(-1))
export const double = partial(multiply, real(2))

// Defined as a multimethod to propagate type information.
export const divide: Multiply = multi(
  method([Base, Base], (l: Base, r: Base) => multiply(l, reciprocal(r)))
)
