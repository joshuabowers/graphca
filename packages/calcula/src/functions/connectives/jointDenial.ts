import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { Complement, isComplement, not } from './complement'
import { or } from './disjunction'
import { and } from './conjunction'
import { Unicode } from '../../Unicode'

export type JointDenial = Connective<Species.nor>

export const [nor, isJointDenial, $nor] = binary<JointDenial, Boolean>(
  Unicode.nor, Notation.infix, Species.nor, Genera.connective
)(
  (l, r) => not(or(l, r)),
  (l, r) => not(or(l, r)),
  (l, r) => not(or(l, r))
)(
  when(
    [_, isValue(boolean(true))],
    [boolean(false), 'joint deniable annihilator']
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(false), 'joint deniable annihilator']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(l), 'joint deniable complementation']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(r), 'joint deniable complementation']
  ),
  when(
    deepEquals, 
    (l, _r) => [not(l), 'joint deniable complementation']
  ),
  when<Complement, Complement>(
    (l, r) => isComplement(l) && isComplement(r),
    (l, r) => [
      and(l.value.expression, r.value.expression), 
      'De Morgan'
    ]
  ),
  when(
    (l, r) => isComplement(r) && deepEquals(l, r.value.expression),
    [boolean(false), 'joint deniable annihilator']
  ),
  when(
    (l, r) => isComplement(l) && deepEquals(l.value.expression, r),
    [boolean(false), 'joint deniable annihilator']
  )
)
