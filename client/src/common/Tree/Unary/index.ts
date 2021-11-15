export { Unary, unary } from './Unary'
export { Negation, negate } from './Negation'
export { BinaryLogarithm, lb } from './BinaryLogarithm'
export { NaturalLogarithm, ln } from './NaturalLogarithm'
export { CommonLogarithm, lg } from './CommonLogarithm'
export { Cosine, cos } from './Cosine'
export { Sine, sin } from './Sine'
export { Tangent, tan } from './Tangent'

import { BinaryLogarithm } from './BinaryLogarithm'
import { CommonLogarithm } from './CommonLogarithm'
import { NaturalLogarithm } from './NaturalLogarithm'
export type Logarithm = BinaryLogarithm | NaturalLogarithm | CommonLogarithm

import { Cosine } from './Cosine'
import { Sine } from './Sine'
import { Tangent } from './Tangent'
export type Trigonometric = Cosine | Sine | Tangent
