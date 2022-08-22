import { Real, real, isReal } from './real'
import { Complex, complex, isComplex } from './complex'
import { Boolean, boolean, isBoolean } from './boolean'
import { Nil, nil, isNil } from './nil'
import { NaN, nan, isNaN } from './nan'

export type Primitive = Real | Complex | Boolean | Nil | NaN
export { Real, Complex, Boolean, Nil, NaN }

export type PrimitiveFns = 
| typeof real | typeof complex | typeof boolean

export { real, complex, boolean, nil, nan }
export { isReal, isComplex, isBoolean, isNil, isNaN }
export { isPrimitive, PrimitiveNode } from '../closures/primitive'
