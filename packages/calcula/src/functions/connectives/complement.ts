import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation, isSpecies } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { Unary, unary, when } from "../../closures/unary"
import { Conjunction, and } from './conjunction'
import { Disjunction, or } from './disjunction'
import { ExclusiveDisjunction, xor } from './exclusiveDisjunction'
import { Implication } from './implication'
import { AlternativeDenial, nand } from './alternativeDenial'
import { JointDenial, nor } from './jointDenial'
import { Biconditional, xnor } from './biconditional'
import { ConverseImplication } from './converseImplication'
import { Unicode } from '../../Unicode'

export type Complement = Unary<Species.not, Genera.connective>

export const [not, isComplement, $not] = unary<Complement, Boolean>(
  Unicode.not, Notation.prefix, Species.not, Genera.connective
)(
  r => boolean(r.value.raw === 0),
  c => boolean(c.value.raw.a === 0 && c.value.raw.b === 0), 
  b => boolean(!b.value.raw) 
)(
  // NOTE: Cannot use derived isSpecies guards as they are not defined
  // by this point.
  when<Complement>(
    isSpecies(Species.not), 
    v => [v.value.expression, 'double complement']
  ),
  when<Conjunction>(
    isSpecies(Species.and), 
    v => [nand(v.value.left, v.value.right), 'complement of conjunction']
  ),
  when<Disjunction>(
    isSpecies(Species.or), 
    v => [nor(v.value.left, v.value.right), 'complement of disjunction']
  ),
  when<AlternativeDenial>(
    isSpecies(Species.nand), 
    v => [and(v.value.left, v.value.right), 'complement of alternative denial']
  ),
  when<JointDenial>(
    isSpecies(Species.nor), 
    v => [or(v.value.left, v.value.right), 'complement of joint denial']
  ),
  when<ExclusiveDisjunction>(
    isSpecies(Species.xor), 
    v => [xnor(v.value.left, v.value.right), 'complement of exclusive disjunction']
  ),
  when<Implication>(
    isSpecies(Species.implies),
    v => [
      and(v.value.left, not(v.value.right)), 
      'complement of implication'
    ]
  ),
  when<Biconditional>(
    isSpecies(Species.xnor),
    v => [xor(v.value.left, v.value.right), 'complement of biconditional']
  ),
  when<ConverseImplication>(
    isSpecies(Species.converse),
    v => [
      and(not(v.value.left), v.value.right), 
      'complement of converse implication'
    ]
  )
)
