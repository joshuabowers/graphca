import { Node, Kind, Visitor } from './Node'
export type { Node, Visitor }
export { Kind }

export abstract class Expression implements Node {
  abstract readonly $kind: Kind

  abstract toString(): string

  equals(that: Node): boolean {
    return this.$kind === that.$kind
  }

  abstract accept<Value>(visitor: Visitor<Value>): Value
}

export abstract class Base {
  abstract readonly $kind: string
}

export class Real extends Base {
  readonly $kind = 'Real'

  constructor(readonly value: number) { super() }
}

export class Complex extends Base {
  readonly $kind = 'Complex'
  constructor(readonly a: number, readonly b: number) { super() }
}

export class Variable extends Base {
  readonly $kind = 'Variable'
  constructor(readonly name: string) { super() }
}

// export type BinaryFunction =
//   | Kind.Addition | Kind.Multiplication | Kind.Exponentiation

export abstract class Binary extends Base {
  constructor(readonly left: Base, readonly right: Base) { super() }
}

export class Addition extends Binary {
  readonly $kind = 'Addition'
}

export class Multiplication extends Binary {
  readonly $kind = 'Multiplication'
}

export class Exponentiation extends Binary {
  readonly $kind = 'Exponentiation'
}

export type Tree = 
  | Real | Complex | Variable 
  | Addition | Multiplication | Exponentiation

// export interface Addition extends Binary {
//   $kind: Kind.Addition
// }

// export interface Multiplication extends Binary {
//   $kind: Kind.Multiplication
// }

// export interface Exponentiation extends Binary {
//   $kind: Kind.Exponentiation
// }

export interface Unary {
  $kind: 
    | 'AbsoluteValue' | 'Logarithm' | 'Factorial' | 'Gamma'
    | 'ArcusCosecant' | 'ArcusCosine' | 'ArcusCotangent' 
    | 'ArcusSecant' | 'ArcusSine'| 'ArcusTangent'  
    | 'AreaHyperbolicCosecant' | 'AreaHyperbolicCosine'
    | 'AreaHyperbolicCotangent' | 'AreaHyperbolicSecant'
    | 'AreaHyperbolicSine' | 'AreaHyperbolicTangent'
    | 'HyperbolicCosecant' | 'HyperbolicCosine'
    | 'HyperbolicCotangent' | 'HyperbolicSecant'
    | 'HyperbolicSine' | 'HyperbolicTangent'
    | 'Sine' | 'Cosine' | 'Tangent'
    | 'Cosecant' | 'Secant' | 'Cotangent'
  expression: FunExp
}

// export interface Polygamma {
//   $kind: Kind.Polygamma
//   order: FunExp
//   expression: FunExp
// }

// export interface Derivative {
//   $kind: Kind.Derivative
//   expression: FunExp
// }

// export type FunExp = 
//   | Real | Complex | Variable 
//   | Binary | Unary //| Polygamma | Derivative

export type FunExp =
  | { $kind: 'Real', value: number }
  | { $kind: 'Complex', a: number, b: number }
  | { $kind: 'Variable', name: string }
  | { 
    $kind: 'Addition',
    left: FunExp,
    right: FunExp
  } | {
    $kind: 'Multiplication',
    left: FunExp,
    right: FunExp,
  } | {
    $kind: 'Exponentiation',
    left: FunExp,
    right: FunExp
  } | {
    $kind: 
    | 'AbsoluteValue' | 'Logarithm' | 'Factorial' | 'Gamma'
    | 'ArcusCosecant' | 'ArcusCosine' | 'ArcusCotangent' 
    | 'ArcusSecant' | 'ArcusSine'| 'ArcusTangent'  
    | 'AreaHyperbolicCosecant' | 'AreaHyperbolicCosine'
    | 'AreaHyperbolicCotangent' | 'AreaHyperbolicSecant'
    | 'AreaHyperbolicSine' | 'AreaHyperbolicTangent'
    | 'HyperbolicCosecant' | 'HyperbolicCosine'
    | 'HyperbolicCotangent' | 'HyperbolicSecant'
    | 'HyperbolicSine' | 'HyperbolicTangent'
    | 'Sine' | 'Cosine' | 'Tangent'
    | 'Cosecant' | 'Secant' | 'Cotangent',
    expression: FunExp
  }
