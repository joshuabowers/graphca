import { Addition, Multiplication, Real, Complex, Base} from './Expression'
import { method, multi, Multi, _ } from '@arrows/multimethod';
import { real } from './real';
import { complex } from "./complex";
import { multiply, negate, double } from './multiplication';
import { equals } from "./equality";

const addReals = (left: Real, right: Real) => real(left.value + right.value)
const addComplex = (left: Complex, right: Complex) => complex(left.a + right.a, left.b + right.b)
const addRC = (left: Real, right: Complex) => complex(left.value + right.a, right.b)
const addCR = (left: Complex, right: Real) => complex(left.a + right.value, left.b)
const otherwise = (left: Base, right: Base) => new Addition(left, right)
const failure = (_left: never, _right: never) => undefined

export type Add = Multi 
  & typeof addReals 
  & typeof addComplex 
  & typeof addRC 
  & typeof addCR
  & typeof otherwise
  & typeof failure

const isXpR_R = (l: Base, r: Base) =>
  l instanceof Addition 
  && (l.right instanceof Real || l.right instanceof Complex)
  && (r instanceof Real || r instanceof Complex)

const isXpY_X = (l: Base, r: Base) => 
  l instanceof Addition && equals(l.left, r)
const isYpX_X = (l: Base, r: Base) =>
  l instanceof Addition && equals(l.right, r)
const isX_XpY = (l: Base, r: Base) =>
  r instanceof Addition && equals(l, r.left)
const isX_YpX = (l: Base, r: Base) =>
  r instanceof Addition && equals(l, r.right)

const isXxY_X = (l: Base, r: Base) =>
  l instanceof Multiplication && equals(l.left, r)
const isYxX_X = (l: Base, r: Base) =>
  l instanceof Multiplication && equals(l.right, r)
const isX_XxY = (l: Base, r: Base) =>
  r instanceof Multiplication && equals(l, r.left)
const isX_YxX = (l: Base, r: Base) =>
  r instanceof Multiplication && equals(l, r.right)

const isXxZ_YxZ = (l: Base, r: Base) =>
  l instanceof Multiplication && r instanceof Multiplication 
  && equals(l.right, r.right)
const isZxX_YxZ = (l: Base, r: Base) =>
  l instanceof Multiplication && r instanceof Multiplication
  && equals(l.left, r.right)
const isXxZ_ZxY = (l: Base, r: Base) =>
  l instanceof Multiplication && r instanceof Multiplication
  && equals(l.right, r.left)
const isZxX_ZxY = (l: Base, r: Base) =>
  l instanceof Multiplication && r instanceof Multiplication
  && equals(l.left, r.left)

export const add: Add = multi(
  method([real(0), _], (_l: Real, r: Base) => r),
  method([_, real(0)], (l: Base, _r: Real) => l),
  method([Real, Real], addReals),
  method([Complex, Complex], addComplex),
  method([Real, Complex], addRC),
  method([Complex, Real], addCR),
  method([Complex, _], (l: Complex, r: Base) => add(r, l)),
  method([Real, _], (l: Real, r: Base) => add(r, l)),
  method(equals, (l: Base, _r: Base) => double(l)),
  method(isXpR_R, (l: Addition, r: Real) => add(l.left, add(l.right, r))),
  method(isXpY_X, (l: Addition, r: Base) => add(double(r), l.right)),
  method(isYpX_X, (l: Addition, r: Base) => add(double(r), l.left)),
  method(isX_XpY, (l: Base, r: Addition) => add(double(l), r.right)),
  method(isX_YpX, (l: Base, r: Addition) => add(double(l), r.left)),
  method(isXxZ_YxZ, (l: Multiplication, r: Multiplication) => multiply(add(l.left, r.left), l.right)),
  method(isZxX_YxZ, (l: Multiplication, r: Multiplication) => multiply(add(l.right, r.left), l.left)),
  method(isXxZ_ZxY, (l: Multiplication, r: Multiplication) => multiply(add(l.left, r.right), l.right)),
  method(isZxX_ZxY, (l: Multiplication, r: Multiplication) => multiply(add(l.right, r.right), l.left)),
  method(isXxY_X, (l: Multiplication, r: Base) => multiply(add(real(1), l.right), r)),
  method(isYxX_X, (l: Multiplication, r: Base) => multiply(add(real(1), l.left), r)),
  method(isX_XxY, (l: Base, r: Multiplication) => multiply(add(real(1), r.right), l)),
  method(isX_YxX, (l: Base, r: Multiplication) => multiply(add(real(1), r.left), l)),
  method([Base, Base], otherwise),
  method([_, _], failure)
)

export function subtract(left: Base, right: Base) {
  return add(left, negate(right))
}
