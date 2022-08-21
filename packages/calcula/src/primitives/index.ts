import { Real } from './real'
import { Complex } from './complex'
import { Boolean } from './boolean'
import { Nil } from './nil'
import { NaN } from './nan'

export type Primitive = Real | Complex | Boolean | Nil | NaN
export { Real, Complex, Boolean, Nil, NaN }
