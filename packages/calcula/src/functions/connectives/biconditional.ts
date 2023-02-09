import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { binary, when } from "../../closures/binary"
import { deepEquals, isValue } from "../../utility/deepEquals"
import { Connective } from './connective'
import { not } from './complement'
import { and } from './conjunction'
import { implies } from './implication'
import { Unicode } from '../../Unicode'

export type Biconditional = Connective<Species.xnor>

export const [xnor, isBiconditional, $xnor] = binary<Biconditional, Boolean>(
  Unicode.xnor, Notation.infix, Species.xnor, Genera.connective
)(
  (l, r) => and(implies(l, r), implies(r, l)), 
  (l, r) => and(implies(l, r), implies(r, l)), 
  (l, r) => and(implies(l, r), implies(r, l)), 
)(
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [r, 'biconditional identity']
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [l, 'biconditional identity']
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(r), 'biconditional complementation']
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(l), 'biconditional complementation']
  ),
  when(deepEquals, [boolean(true), 'biconditional annihilator'])
)
