import { Writer } from "../monads/writer"

export enum Clades {
  primitive = 'Primitive',  // Constants: 10, 4 - 5i, true
  unary = 'Unary',          // Functions and Ops: not, abs, sin
  binary = 'Binary',        // Functions and Ops: and, log, polygamma
  variadic = 'Variadic'     // Variables: x, OhGodWhy
}

export enum Genera {
  arithmetic = 'Arithmetic',
  connective = 'Connective',
  inequalities = 'Inequalities',
  trigonometric = 'Trigonometric',
  arcus = 'Arcus',
  hyperbolic = 'Hyperbolic',
  areaHyperbolic = 'AreaHyperbolic',
  combinatorics = 'Combinatorics'
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

  // Functions
  abs = 'Absolute',

  // :: Inequalities
  equals = 'Equality',
  notEquals = 'Inequality',
  lessThan = 'LessThan',
  greaterThan = 'GreaterThan',
  lessThanEquals = 'LessThanEquals',
  greaterThanEquals = 'GreaterThanEquals',

  // :: Connectives
  not = 'Complement',
  and = 'Conjunction',
  or = 'Disjunction',
  xor = 'ExclusiveDisjunction',
  implies = 'Implication',
  nand = 'AlternativeDenial',
  nor = 'JointDenial',
  xnor = 'Biconditional',
  converse = 'ConverseImplication',

  // :: Trigonometric
  sin = 'Sine',
  cos = 'Cosine',
  tan = 'Tangent',
  csc = 'Cosecant',
  sec = 'Secant',
  cot = 'Cotangent',

  // Variables
  variable = 'Variable'
}

export type TreeNode = {
  readonly clade: Clades,
  readonly genus?: Genera,
  readonly species: Species
}

export type DerivedNode<T extends ((...args: any[]) => any)> = 
  ReturnType<T> extends Writer<infer U> ? U : never

export type TreeNodeGuardFn<T extends TreeNode> = 
  (value: Writer<TreeNode>) => value is Writer<T>

// values should be Writer<TreeNode>, narrowed to Writer<T>
export const isClade = <T extends TreeNode>(clade: Clades) =>
  (value: Writer<TreeNode>): value is Writer<T> =>
    value?.value.clade === clade

export const isGenus = <T extends TreeNode>(genus: Genera) =>
  (value: Writer<TreeNode>): value is Writer<T> =>
    value?.value.genus === genus

export const isSpecies = <T extends TreeNode>(species: Species) =>
  (value: Writer<TreeNode>): value is Writer<T> =>
    value?.value.species === species

export const notAny = (...args: Species[]) => {
  const exclude = new Set(args)
  return <T extends TreeNode>(t: Writer<T>) => 
    t.value && !exclude.has(t.value.species)
}

export const any = (...args: Species[]) => {
  const include = new Set(args)
  return <T extends TreeNode>(t: Writer<T>) => 
    t.value && include.has(t.value.species)
}
