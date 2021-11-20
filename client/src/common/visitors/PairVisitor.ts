import { 
  Exponentiation, Multiplication, Real, Subtraction, Variable,
  Addition, Complex, Division, Expression
} from '../Tree'

type Node = {
  'Expression': Expression,
  'Real': Real,
  'Complex': Complex,
  'Variable': Variable,
  'Addition': Addition,
  'Subtraction': Subtraction,
  'Multiplication': Multiplication,
  'Division': Division
  'Exponentiation': Exponentiation
}

/**
 * Converts a union, U, to an intersection of the parts of the union
 * @see {@link https://stackoverflow.com/a/50375286}
 */
type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

type Visit<T extends keyof Node, Return> = {
  [U in keyof Node as `visit${T}And${U}`]?: (a: Node[T], b: Node[U]) => Return
}

type ConcreteNodes = Omit<Node, 'Expression'>

type Permutations<Return> = {
  [T in keyof ConcreteNodes]: Visit<T, Return>
}

type Visitable<Return> = UnionToIntersection<Permutations<Return>[keyof ConcreteNodes]>

export interface PairVisitor<Return> extends Visitable<Return> {
  visitDefault(a: Expression, b: Expression): Return
}
