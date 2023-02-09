import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { or } from './disjunction'
import { Unicode } from '../../Unicode'

export type Implication = Connective<Species.implies>

export const [implies, isImplication, $implies] = binary<Implication, Boolean>(
  Unicode.implies, Notation.infix, Species.implies, Genera.connective
)(
  (l, r) => or(not(l), r),
  (l, r) => or(not(l), r),
  (l, r) => or(not(l), r)
)(
  when(
    [isValue(boolean(true)), _], 
    (_l, r) => [r, 'implicative identity']
  ),
  when(
    [_, isValue(boolean(true))], 
    [boolean(true), 'implicative annihilator']
  ),
  when(
    [isValue(boolean(false)), _], 
    [boolean(true), 'implicative annihilator']
  ),
  when(
    [_, isValue(boolean(false))], 
    (l, _r) => [
      not(l), 'implicative complementation'
    ]
  )
)
