import { BinaryLogarithm } from './BinaryLogarithm'
import { CommonLogarithm } from './CommonLogarithm'
import { NaturalLogarithm } from './NaturalLogarithm'
import { Cosine } from './Cosine'
import { Sine } from './Sine'
import { Tangent } from './Tangent'
import { Secant } from './Secant'
import { Cosecant } from './Cosecant'
import { Cotangent } from './Cotangent'
import { ArcusCosine } from './ArcusCosine'
import { ArcusSine } from './ArcusSine'
import { ArcusTangent } from './ArcusTangent'
import { ArcusSecant } from './ArcusSecant'
import { ArcusCosecant } from './ArcusCosecant'
import { ArcusCotangent } from './ArcusCotangent'
import { HyperbolicCosine } from './HyperbolicCosine'
import { HyperbolicSine } from './HyperbolicSine'
import { HyperbolicTangent } from './HyperbolicTangent'
import { HyperbolicSecant } from './HyperbolicSecant'
import { HyperbolicCosecant } from './HyperbolicCosecant'
import { HyperbolicCotangent } from './HyperbolicCotangent'
import { AreaHyperbolicCosine } from './AreaHyperbolicCosine'
import { AreaHyperbolicSine } from './AreaHyperbolicSine'
import { AreaHyperbolicTangent } from './AreaHyperbolicTangent'
import { AreaHyperbolicSecant } from './AreaHyperbolicSecant'
import { AreaHyperbolicCosecant } from './AreaHyperbolicCosecant'
import { AreaHyperbolicCotangent } from './AreaHyperbolicCotangent'
import { Factorial } from './Factorial'
import { Gamma } from './Gamma'

export { Unary, unary } from './Unary'

export { Negation, negate } from './Negation'
export { AbsoluteValue, abs } from './AbsoluteValue'

export { BinaryLogarithm, lb } from './BinaryLogarithm'
export { NaturalLogarithm, ln } from './NaturalLogarithm'
export { CommonLogarithm, lg } from './CommonLogarithm'

export { Cosine, cos } from './Cosine'
export { Sine, sin } from './Sine'
export { Tangent, tan } from './Tangent'
export { Secant, sec } from './Secant'
export { Cosecant, csc } from './Cosecant'
export { Cotangent, cot } from './Cotangent'

export { ArcusCosine, acos } from './ArcusCosine'
export { ArcusSine, asin } from './ArcusSine'
export { ArcusTangent, atan } from './ArcusTangent'
export { ArcusSecant, asec } from './ArcusSecant'
export { ArcusCosecant, acsc } from './ArcusCosecant'
export { ArcusCotangent, acot } from './ArcusCotangent'

export { HyperbolicCosine, cosh } from './HyperbolicCosine'
export { HyperbolicSine, sinh } from './HyperbolicSine'
export { HyperbolicTangent, tanh } from './HyperbolicTangent'
export { HyperbolicSecant, sech } from './HyperbolicSecant'
export { HyperbolicCosecant, csch } from './HyperbolicCosecant'
export { HyperbolicCotangent, coth } from './HyperbolicCotangent'

export { AreaHyperbolicCosine, acosh } from './AreaHyperbolicCosine'
export { AreaHyperbolicSine, asinh } from './AreaHyperbolicSine'
export { AreaHyperbolicTangent, atanh } from './AreaHyperbolicTangent'
export { AreaHyperbolicSecant, asech } from './AreaHyperbolicSecant'
export { AreaHyperbolicCosecant, acsch } from './AreaHyperbolicCosecant'
export { AreaHyperbolicCotangent, acoth } from './AreaHyperbolicCotangent'

export { Factorial, factorial } from './Factorial'
export { Gamma, gamma } from './Gamma'

export type Logarithm = BinaryLogarithm | NaturalLogarithm | CommonLogarithm

export type Trigonometric = 
  | Cosine | Sine | Tangent 
  | Secant | Cosecant | Cotangent

export type Arcus = 
  | ArcusCosine | ArcusSine | ArcusTangent 
  | ArcusSecant | ArcusCosecant | ArcusCotangent

export type Hyperbolic = 
  | HyperbolicCosine | HyperbolicSine | HyperbolicTangent 
  | HyperbolicSecant | HyperbolicCosecant | HyperbolicCotangent

export type AreaHyperbolic = 
  | AreaHyperbolicCosine | AreaHyperbolicSine | AreaHyperbolicTangent
  | AreaHyperbolicSecant | AreaHyperbolicCosecant | AreaHyperbolicCotangent

export type FactorialLike = Factorial | Gamma
