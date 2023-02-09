import { isWriter, Writer } from "../monads/writer"
import { Operation } from "./operation"

export enum Clades {
  primitive = 'Primitive',  // Constants: 10, 4 - 5i, true
  unary = 'Unary',          // Functions and Ops: not, abs, sin
  binary = 'Binary',        // Functions and Ops: and, log, polygamma
  variadic = 'Variadic'     // Variables: x, OhGodWhy
}

export enum Genera {
  arithmetic = 'Arithmetic',
  logarithmic = 'Logarithmic',
  connective = 'Connective',
  inequalities = 'Inequalities',
  trigonometric = 'Trigonometric',
  arcus = 'Arcus',
  hyperbolic = 'Hyperbolic',
  areaHyperbolic = 'AreaHyperbolic',
  combinatorics = 'Combinatorics',
}

export enum Species {
  // Primitives
  real = 'Real',
  complex = 'Complex',
  boolean = 'Boolean',
  nil = 'Nil',
  nan = 'NaN',

  // Arithmetic
  add = 'Addition',
  multiply = 'Multiplication',
  raise = 'Exponentiation',

  // Logarithmic
  log = 'Logarithm',

  // Functions
  abs = 'Absolute',
  factorial = 'Factorial',
  gamma = 'Gamma',
  polygamma = 'Polygamma',

  // :: Inequalities
  equals = 'Equality',
  notEquals = 'Inequality',
  lessThan = 'Less Than',
  greaterThan = 'Greater Than',
  lessThanEquals = 'Less Than Equals',
  greaterThanEquals = 'Greater Than Equals',

  // :: Connectives
  not = 'Complement',
  and = 'Conjunction',
  or = 'Disjunction',
  xor = 'Exclusive Disjunction',
  implies = 'Implication',
  nand = 'Alternative Denial',
  nor = 'Joint Denial',
  xnor = 'Biconditional',
  converse = 'Converse Implication',

  // :: Trigonometric
  sin = 'Sine',
  cos = 'Cosine',
  tan = 'Tangent',
  csc = 'Cosecant',
  sec = 'Secant',
  cot = 'Cotangent',

  // :: Arcus
  asin = 'Arcus Sine',
  acos = 'Arcus Cosine',
  atan = 'Arcus Tangent',
  acsc = 'Arcus Cosecant',
  asec = 'Arcus Secant',
  acot = 'Arcus Cotangent',

  // :: Hyperbolic
  sinh = 'Hyperbolic Sine',
  cosh = 'Hyperbolic Cosine',
  tanh = 'Hyperbolic Tangent',
  csch = 'Hyperbolic Cosecant',
  sech = 'Hyperbolic Secant',
  coth = 'Hyperbolic Cotangent',

  // :: Area Hyperbolic
  asinh = 'Area Hyperbolic Sine',
  acosh = 'Area Hyperbolic Cosine',
  atanh = 'Area Hyperbolic Tangent',
  acsch = 'Area Hyperbolic Cosecant',
  asech = 'Area Hyperbolic Secant',
  acoth = 'Area Hyperbolic Cotangent',

  // :: Combinatorics
  permute = 'Permutation',
  combine = 'Combination',

  // Variables
  variable = 'Variable',

  // Immediate Functions (no AST representation)
  differentiate = 'Differentiation',
  invoke = 'Invocation'
}

export enum Notation {
  prefix,
  infix,
  postfix
}

export type TreeNode = {
  readonly clade: Clades,
  readonly genus?: Genera,
  readonly species: Species
}

export type DerivedNode<T extends ((...args: any[]) => any)> = 
  ReturnType<T> extends Writer<infer U, Operation> ? U : never

export type TreeNodeGuardFn<T extends TreeNode> = 
  (value: Writer<TreeNode, Operation>) => value is Writer<T, Operation>

// values should be Writer<TreeNode>, narrowed to Writer<T>
export const isClade = <T extends TreeNode>(clade: Clades) =>
  (value: Writer<TreeNode, Operation>): value is Writer<T, Operation> =>
    value?.value.clade === clade

export const isGenus = <T extends TreeNode>(genus: Genera) =>
  (value: Writer<TreeNode, Operation>): value is Writer<T, Operation> =>
    value?.value.genus === genus

export const isSpecies = <T extends TreeNode>(species: Species) =>
  (value: Writer<TreeNode, Operation>): value is Writer<T, Operation> =>
    value?.value.species === species

export const isTreeNode = <T extends TreeNode>(value: unknown): value is Writer<T, Operation> =>
  isWriter(value) && typeof value.value === 'object' 
  && 'clade' in value.value! && 'species' in value.value!

export const notAny = (...args: Species[]) => {
  const exclude = new Set(args)
  return <T extends TreeNode>(t: Writer<T, Operation>) => 
    t.value && !exclude.has(t.value.species)
}

export const any = (...args: Species[]) => {
  const include = new Set(args)
  return <T extends TreeNode>(t: Writer<T, Operation>) => 
    t.value && include.has(t.value.species)
}

export const eitherNilOrNaN = any(Species.nil, Species.nan)
