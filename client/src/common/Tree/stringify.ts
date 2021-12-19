import { Unicode } from '../MathSymbols'
import { method, multi, Multi } from '@arrows/multimethod'
import { is, Constructor } from './is'
import { Base } from './Expression'
import { Real } from './real'
import { Complex } from './complex'
import { Variable } from './variable'
import { Binary } from './binary'
import { Addition } from './addition'
import { Multiplication } from './multiplication'
import { Exponentiation } from './exponentiation'
import { Logarithm } from './logarithmic'
import { Permutation, Combination } from './combinatorics'
import { Unary } from './unary'
import { Cosine, Sine, Tangent, Secant, Cosecant, Cotangent } from './trigonometric'
import { 
  ArcusCosine, ArcusSine, ArcusTangent, 
  ArcusSecant, ArcusCosecant, ArcusCotangent 
} from './arcus'
import { 
  HyperbolicCosine, HyperbolicSine, HyperbolicTangent, 
  HyperbolicSecant, HyperbolicCosecant, HyperbolicCotangent 
} from './hyperbolic'
import { 
  AreaHyperbolicCosine, AreaHyperbolicSine, AreaHyperbolicTangent, 
  AreaHyperbolicSecant, AreaHyperbolicCosecant, AreaHyperbolicCotangent 
} from './areaHyperbolic'
import { Factorial } from './factorial'
import { Gamma } from './gamma'
import { Polygamma } from './polygamma'
import { AbsoluteValue } from './absolute'

type ToString<T> = (expression: T) => string

const visit = <T extends Base>(type: Constructor<T>) =>
  (fn: ToString<T>) =>
    method(is(type), fn)

const binaryInfix = (operator: string) => 
  (e: Binary) =>
    `(${stringify(e.left)}${operator}${stringify(e.right)})`

const binary = (name: string) =>
  (e: Binary) =>
    `${name}(${stringify(e.left)},${stringify(e.right)})`

const unary = (name: string) =>
  (e: Unary) =>
    `${name}(${stringify(e.expression)})`

export type StringifyFn = Multi
  & ToString<Real>
  & ToString<Complex>
  & ToString<Variable>
  & ToString<Addition>
  & ToString<Multiplication>
  & ToString<Exponentiation>
  & ToString<Logarithm>
  & ToString<Permutation>
  & ToString<Combination>
  & ToString<Cosine>
  & ToString<Sine>
  & ToString<Tangent>
  & ToString<Secant>
  & ToString<Cosecant>
  & ToString<Cotangent>
  & ToString<ArcusCosine>
  & ToString<ArcusSine>
  & ToString<ArcusTangent>
  & ToString<ArcusSecant>
  & ToString<ArcusCosecant>
  & ToString<ArcusCotangent>
  & ToString<HyperbolicCosine>
  & ToString<HyperbolicSine>
  & ToString<HyperbolicTangent>
  & ToString<HyperbolicSecant>
  & ToString<HyperbolicCosecant>
  & ToString<HyperbolicCotangent>
  & ToString<AreaHyperbolicCosine>
  & ToString<AreaHyperbolicSine>
  & ToString<AreaHyperbolicTangent>
  & ToString<AreaHyperbolicSecant>
  & ToString<AreaHyperbolicCosecant>
  & ToString<AreaHyperbolicCotangent>
  & ToString<Factorial>
  & ToString<Gamma>
  & ToString<Polygamma>
  & ToString<AbsoluteValue>
  & ToString<Base>

export const stringify: StringifyFn = multi(
  visit(Real)(r => r.value.toString()),
  visit(Complex)(c => `${c.a}${c.b > 0 ? '+' : ''}${c.b}${Unicode.i}`),
  visit(Variable)(v => v.name),
  visit(Addition)(binaryInfix('+')),
  visit(Multiplication)(binaryInfix(Unicode.multiplication)),
  visit(Exponentiation)(binaryInfix('^')),
  visit(Logarithm)(binary('log')),
  visit(Permutation)(binary('P')),
  visit(Combination)(binary('C')),
  visit(Cosine)(unary('cos')),
  visit(Sine)(unary('sin')),
  visit(Tangent)(unary('tan')),
  visit(Secant)(unary('sec')),
  visit(Cosecant)(unary('csc')),
  visit(Cotangent)(unary('cot')),
  visit(ArcusCosine)(unary('acos')),
  visit(ArcusSine)(unary('asin')),
  visit(ArcusTangent)(unary('atan')),
  visit(ArcusSecant)(unary('asec')),
  visit(ArcusCosecant)(unary('acsc')),
  visit(ArcusCotangent)(unary('acot')),
  visit(HyperbolicCosine)(unary('cosh')),
  visit(HyperbolicSine)(unary('sinh')),
  visit(HyperbolicTangent)(unary('tanh')),
  visit(HyperbolicSecant)(unary('sech')),
  visit(HyperbolicCosecant)(unary('csch')),
  visit(HyperbolicCotangent)(unary('coth')),
  visit(AreaHyperbolicCosine)(unary('acosh')),
  visit(AreaHyperbolicSine)(unary('asinh')),
  visit(AreaHyperbolicTangent)(unary('atanh')),
  visit(AreaHyperbolicSecant)(unary('asech')),
  visit(AreaHyperbolicCosecant)(unary('acsch')),
  visit(AreaHyperbolicCotangent)(unary('acoth')),
  visit(Factorial)(f => `(${stringify(f.expression)})!`),
  visit(Gamma)(unary(Unicode.gamma)),
  visit(Polygamma)(binary(Unicode.digamma)),
  visit(AbsoluteValue)(unary('abs')),
  visit(Base)(e => `Unhandled expression type: '${e.$kind}'`)
)
