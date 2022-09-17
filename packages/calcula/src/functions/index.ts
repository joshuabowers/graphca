import { Unicode } from "../Unicode"
import { 
  Equality, StrictInequality, LessThan, GreaterThan,
  LessThanEquals, GreaterThanEquals,
  equals, notEquals, lessThan, greaterThan,
  lessThanEquals, greaterThanEquals,
  isEquality, isStrictInequality, isLessThan, isGreaterThan,
  isLessThanEquals, isGreaterThanEquals,
  $equals, $notEquals, $lessThan, $greaterThan,
  $lessThanEquals, $greaterThanEquals
} from "./inequality"
import { 
  Complement, Conjunction, Disjunction, ExclusiveDisjunction,
  Implication, AlternativeDenial, JointDenial, Biconditional, ConverseImplication,
  not, and, or, xor, implies, nand, nor, xnor, converse,
  isComplement, isConjunction, isDisjunction, isExclusiveDisjunction,
  isImplication, isAlternativeDenial, isJointDenial, isBiconditional,
  isConverseImplication, isConnective,
  $not, $and, $or, $xor, $implies, $nand, $nor, $xnor, $converse
} from "./connectives"
import { 
  Logarithm, lb, ln, lg, isLogarithm, $log
} from './logarithmic'
import { 
  Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  cos, sin, tan, sec, csc, cot,
  isTrigonometric,
  isCosine, isSine, isTangent, isSecant, isCosecant, isCotangent,
  $cos, $sin, $tan, $sec, $csc, $cot
} from './trigonometric'
import { 
  ArcusCosine, ArcusSine, ArcusTangent, 
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  acos, asin, atan, asec, acsc, acot,
  isArcus, isArcusCosine, isArcusSine, isArcusTangent,
  isArcusSecant, isArcusCosecant, isArcusCotangent,
  $acos, $asin, $atan, $asec, $acsc, $acot
} from './arcus'
import { 
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  cosh, sinh, tanh, sech, csch, coth,
  isHyperbolic, isHyperbolicCosine, isHyperbolicSine, isHyperbolicTangent,
  isHyperbolicSecant, isHyperbolicCosecant, isHyperbolicCotangent,
  $cosh, $sinh, $tanh, $sech, $csch, $coth
} from './hyperbolic'
import { 
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  acosh, asinh, atanh, asech, acsch, acoth,
  isAreaHyperbolic, isAreaHyperbolicCosine, isAreaHyperbolicSine,
  isAreaHyperbolicTangent, isAreaHyperbolicSecant, isAreaHyperbolicCosecant,
  isAreaHyperbolicCotangent,
  $acosh, $asinh, $atanh, $asech, $acsch, $acoth
} from './areaHyperbolic'
import { 
  Gamma, gamma, isGamma, $gamma
} from './gamma'
import { 
  Absolute, abs, isAbsolute, $abs
} from './absolute'
import { sqrt } from '../arithmetic/exponentiation'

export type InequalityFn = 
| typeof equals | typeof notEquals
| typeof lessThan | typeof greaterThan 
| typeof lessThanEquals | typeof greaterThanEquals

export type ConnectiveFn =
| typeof and | typeof or | typeof xor | typeof implies
| typeof nand | typeof nor | typeof xnor | typeof converse

type Functions = 
| typeof lb | typeof ln | typeof lg
| typeof cos | typeof sin | typeof tan
| typeof sec | typeof csc | typeof cot
| typeof acos | typeof asin | typeof atan
| typeof asec | typeof acsc | typeof acot
| typeof cosh | typeof sinh | typeof tanh
| typeof sech | typeof csch | typeof coth
| typeof acosh | typeof asinh | typeof atanh
| typeof asech | typeof acsch | typeof acoth
| typeof gamma | typeof abs | typeof sqrt

export const inequality = new Map<string, InequalityFn>(
  [
    ['==', equals],
    ['!=', notEquals],
    ['<=', lessThanEquals],
    ['>=', greaterThanEquals],
    ['<', lessThan],
    ['>', greaterThan]
  ]
)

export const connectives = new Map<string, ConnectiveFn>(
  [
    [Unicode.xnor, xnor],
    [Unicode.and, and],
    [Unicode.or, or],
    [Unicode.xor, xor],
    [Unicode.implies, implies],
    [Unicode.nand, nand],
    [Unicode.nor, nor],
    [Unicode.converse, converse],
  ]
)

export const functions = new Map<string, Functions>([
  ['lb', lb],
  ['ln', ln],
  ['lg', lg],
  ['acosh', acosh],
  ['asinh', asinh],
  ['atanh', atanh],
  ['asech', asech],
  ['acsch', acsch],
  ['acoth', acoth],
  ['acos', acos],
  ['asin', asin],
  ['atan', atan],
  ['asec', asec],
  ['acsc', acsc],
  ['acot', acot],
  ['cosh', cosh],
  ['sinh', sinh],
  ['tanh', tanh],
  ['sech', sech],
  ['csch', csch],
  ['coth', coth],
  ['cos', cos],
  ['sin', sin],
  ['tan', tan],
  ['sec', sec],
  ['csc', csc],
  ['cot', cot],
  ['abs', abs],
  [Unicode.gamma, gamma],
  [Unicode.squareRoot, sqrt]
])

export {
  Equality, StrictInequality, LessThan, GreaterThan,
  LessThanEquals, GreaterThanEquals,
  Complement, Conjunction, Disjunction, ExclusiveDisjunction,
  Implication, AlternativeDenial, JointDenial, Biconditional, ConverseImplication, 
  Logarithm, Cosine, Sine, Tangent, Secant, Cosecant, Cotangent,
  ArcusCosine, ArcusSine, ArcusTangent, 
  ArcusSecant, ArcusCosecant, ArcusCotangent,
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent,
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent,
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent,
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent,
  Gamma, Absolute
}

export {
  equals, notEquals, lessThan, greaterThan,
  lessThanEquals, greaterThanEquals,
  not, and, or, xor, implies, nand, nor, xnor, converse,
  lb, ln, lg, cos, sin, tan, sec, csc, cot,
  acos, asin, atan, asec, acsc, acot,
  cosh, sinh, tanh, sech, csch, coth,
  acosh, asinh, atanh, asech, acsch, acoth,
  gamma, abs
}

export {
  isEquality, isStrictInequality, isLessThan, isGreaterThan,
  isLessThanEquals, isGreaterThanEquals,
  isComplement, isConjunction, isDisjunction, isExclusiveDisjunction,
  isImplication, isAlternativeDenial, isJointDenial, isBiconditional,
  isConverseImplication, isConnective, isLogarithm, isTrigonometric,
  isCosine, isSine, isTangent, isSecant, isCosecant, isCotangent,
  isArcus, isArcusCosine, isArcusSine, isArcusTangent,
  isArcusSecant, isArcusCosecant, isArcusCotangent,
  isHyperbolic, isHyperbolicCosine, isHyperbolicSine, isHyperbolicTangent,
  isHyperbolicSecant, isHyperbolicCosecant, isHyperbolicCotangent,
  isAreaHyperbolic, isAreaHyperbolicCosine, isAreaHyperbolicSine,
  isAreaHyperbolicTangent, isAreaHyperbolicSecant, isAreaHyperbolicCosecant,
  isAreaHyperbolicCotangent, isGamma, isAbsolute
}

export {
  $equals, $notEquals, $lessThan, $greaterThan,
  $lessThanEquals, $greaterThanEquals,
  $not, $and, $or, $xor, $implies, $nand, $nor, $xnor, $converse,
  $log, $cos, $sin, $tan, $sec, $csc, $cot,
  $acos, $asin, $atan, $asec, $acsc, $acot,
  $cosh, $sinh, $tanh, $sech, $csch, $coth,
  $acosh, $asinh, $atanh, $asech, $acsch, $acoth,
  $gamma, $abs
}

export { Factorial, factorial, isFactorial, $factorial } from './factorial'
export { 
  Polygamma, polygamma, digamma, isPolygamma, $polygamma 
} from './polygamma'
export { 
  Permutation, Combination, 
  permute, combine, 
  isPermutation, isCombination, 
  $permute, $combine
} from './combinatorics'
