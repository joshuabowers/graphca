export { Unary, unary } from './Unary'

export { Negation, negate } from './Negation'
export { AbsoluteValue, abs } from './AbsoluteValue'

export { BinaryLogarithm, lb } from './BinaryLogarithm'
export { NaturalLogarithm, ln } from './NaturalLogarithm'
export { CommonLogarithm, lg } from './CommonLogarithm'

export { Cosine, cos } from './Cosine'
export { Sine, sin } from './Sine'
export { Tangent, tan } from './Tangent'

export { ArcusCosine, acos } from './ArcusCosine'
export { ArcusSine, asin } from './ArcusSine'
export { ArcusTangent, atan } from './ArcusTangent'

export { HyperbolicCosine, cosh } from './HyperbolicCosine'
export { HyperbolicSine, sinh } from './HyperbolicSine'
export { HyperbolicTangent, tanh } from './HyperbolicTangent'

export { AreaHyperbolicCosine, acosh } from './AreaHyperbolicCosine'
export { AreaHyperbolicSine, asinh } from './AreaHyperbolicSine'
export { AreaHyperbolicTangent, atanh } from './AreaHyperbolicTangent'

export { Factorial, factorial } from './Factorial'
export { Gamma, gamma } from './Gamma'
export { Polygamma, polygamma } from './Polygamma'

import { BinaryLogarithm } from './BinaryLogarithm'
import { CommonLogarithm } from './CommonLogarithm'
import { NaturalLogarithm } from './NaturalLogarithm'
export type Logarithm = BinaryLogarithm | NaturalLogarithm | CommonLogarithm

import { Cosine } from './Cosine'
import { Sine } from './Sine'
import { Tangent } from './Tangent'
export type Trigonometric = Cosine | Sine | Tangent

import { ArcusCosine } from './ArcusCosine'
import { ArcusSine } from './ArcusSine'
import { ArcusTangent } from './ArcusTangent'
export type Arcus = ArcusCosine | ArcusSine | ArcusTangent

import { HyperbolicCosine } from './HyperbolicCosine'
import { HyperbolicSine } from './HyperbolicSine'
import { HyperbolicTangent } from './HyperbolicTangent'
export type Hyperbolic = HyperbolicCosine | HyperbolicSine | HyperbolicTangent

import { AreaHyperbolicCosine } from './AreaHyperbolicCosine'
import { AreaHyperbolicSine } from './AreaHyperbolicSine'
import { AreaHyperbolicTangent } from './AreaHyperbolicTangent'
export type AreaHyperbolic = AreaHyperbolicCosine | AreaHyperbolicSine | AreaHyperbolicTangent

import { Factorial } from './Factorial'
import { Gamma } from './Gamma'
import { Polygamma } from './Polygamma'
export type FactorialLike = Factorial | Gamma | Polygamma
