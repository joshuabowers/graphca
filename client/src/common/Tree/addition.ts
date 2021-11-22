import { Tree, Kind, Addition, Real, Complex, Base} from './Expression'
import { method, multi, Multi, _ } from '@arrows/multimethod';
import { real } from './real';
import { complex } from "./complex";
import { negate, double } from './multiplication';
import { equals } from "./equality";

const addReals = (left: Real, right: Real) => real(left.value + right.value)
const addComplex = (left: Complex, right: Complex) => complex(left.a + right.a, left.b + right.b)
const addRC = (left: Real, right: Complex) => complex(left.value + right.a, right.b)
const addCR = (left: Complex, right: Real) => complex(left.a + right.value, left.b)
const otherwise = (left: Base, right: Base) => new Addition(left, right)

export type Add = Multi 
  & typeof addReals 
  & typeof addComplex 
  & typeof addRC 
  & typeof addCR
  & typeof otherwise

const isXY_X = (l: Base, r: Base) => 
  l instanceof Addition && equals(l.left, r)
const isYX_X = (l: Base, r: Base) =>
  l instanceof Addition && equals(l.right, r)
const isX_XY = (l: Base, r: Base) =>
  r instanceof Addition && equals(l, r.left)
const isX_YX = (l: Base, r: Base) =>
  r instanceof Addition && equals(l, r.right)

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
  method(isXY_X, (l: Addition, r: Base) => add(double(r), l.right)),
  method(isYX_X, (l: Addition, r: Base) => add(double(r), l.left)),
  method(isX_XY, (l: Base, r: Addition) => add(double(l), r.right)),
  method(isX_YX, (l: Base, r: Addition) => add(double(l), r.left)),
  method([Base, Base], otherwise)
)

export function subtract(left: Base, right: Base): Tree {
  return add(left, negate(right))
}
