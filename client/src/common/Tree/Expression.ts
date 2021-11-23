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

export class Logarithm extends Binary {
  readonly $kind = 'Logarithm'
}

export class Polygamma extends Binary {
  readonly $kind = 'Polygamma'
}

export abstract class Unary extends Base {
  constructor(readonly expression: Base) { super() }
}

export class AbsoluteValue extends Unary {
  readonly $kind = 'AbsoluteValue'
}

export class Factorial extends Unary {
  readonly $kind = 'Factorial'
}

export class Gamma extends Unary {
  readonly $kind = 'Gamma'
}

export abstract class Trigonometric extends Unary {}

export class Cosine extends Trigonometric {
  readonly $kind = 'Cosine'
}

export class Sine extends Trigonometric {
  readonly $kind = 'Sine'
}

export class Tangent extends Trigonometric {
  readonly $kind = 'Tangent'
}

export class Secant extends Trigonometric {
  readonly $kind = 'Secant'
}

export class Cosecant extends Trigonometric {
  readonly $kind = 'Cosecant'
}

export class Cotangent extends Trigonometric {
  readonly $kind = 'Cotangent'
}

export abstract class Arcus extends Unary {}

export class ArcusCosine extends Arcus {
  readonly $kind = 'ArcusCosine'
}

export class ArcusSine extends Arcus {
  readonly $kind = 'ArcusSine'
}

export class ArcusTangent extends Arcus {
  readonly $kind = 'ArcusTangent'
}

export class ArcusSecant extends Arcus {
  readonly $kind = 'ArcusSecant'
}

export class ArcusCosecant extends Arcus {
  readonly $kind = 'ArcusCosecant'
}

export class ArcusCotangent extends Arcus {
  readonly $kind = 'ArcusCotangent'
}

export abstract class Hyperbolic extends Unary {}

export class HyperbolicCosine extends Hyperbolic {
  readonly $kind = 'HyperbolicCosine'
}

export class HyperbolicSine extends Hyperbolic {
  readonly $kind = 'HyperbolicSine'
}

export class HyperbolicTangent extends Hyperbolic {
  readonly $kind = 'HyperbolicTangent'
}

export class HyperbolicSecant extends Hyperbolic {
  readonly $kind = 'HyperbolicSecant'
}

export class HyperbolicCosecant extends Hyperbolic {
  readonly $kind = 'HyperbolicCosecant'
}

export class HyperbolicCotangent extends Hyperbolic {
  readonly $kind = 'HyperbolicCotangent'
}

export abstract class AreaHyperbolic extends Unary {}

export class AreaHyperbolicCosine extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicCosine'
}

export class AreaHyperbolicSine extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicSine'
}

export class AreaHyperbolicTangent extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicTangent'
}

export class AreaHyperbolicSecant extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicSecant'
}

export class AreaHyperbolicCosecant extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicCosecant'
}

export class AreaHyperbolicCotangent extends AreaHyperbolic {
  readonly $kind = 'AreaHyperbolicCotangent'
}

export class Derivative extends Base {
  readonly $kind = 'Derivative'
  constructor(readonly expression: Base, readonly order: Base, readonly wrt: Variable[]) { super() }
}

export type Tree = 
  | Real | Complex | Variable 
  | Addition | Multiplication | Exponentiation

// export interface Unary {
//   $kind: 
//     | 'AbsoluteValue' | 'Logarithm' | 'Factorial' | 'Gamma'
//     | 'ArcusCosecant' | 'ArcusCosine' | 'ArcusCotangent' 
//     | 'ArcusSecant' | 'ArcusSine'| 'ArcusTangent'  
//     | 'AreaHyperbolicCosecant' | 'AreaHyperbolicCosine'
//     | 'AreaHyperbolicCotangent' | 'AreaHyperbolicSecant'
//     | 'AreaHyperbolicSine' | 'AreaHyperbolicTangent'
//     | 'HyperbolicCosecant' | 'HyperbolicCosine'
//     | 'HyperbolicCotangent' | 'HyperbolicSecant'
//     | 'HyperbolicSine' | 'HyperbolicTangent'
//     | 'Sine' | 'Cosine' | 'Tangent'
//     | 'Cosecant' | 'Secant' | 'Cotangent'
//   expression: FunExp
// }

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
