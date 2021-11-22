import { method, multi, Multi } from '@arrows/multimethod';
import { Kind, Tree, Multiplication, Base, Real, Complex } from "./Expression";
import { partial } from "./partial";
import { real } from "./real";
import { reciprocal } from "./exponentiation";

const multiplyReals = (left: Real, right: Real) => real(left.value * right.value)
const otherwise = (left: Base, right: Base) => new Multiplication(left, right)

type Multiply = Multi & typeof multiplyReals & typeof otherwise

export const multiply: Multiply = multi(
  method([Real, Real], multiplyReals),
  method([Base, Base], otherwise)
)

export const negate = partial(multiply, real(-1))
export const double = partial(multiply, real(2))

export function divide(left: Tree, right: Tree): Tree {
  return multiply(left, reciprocal(right))
}
