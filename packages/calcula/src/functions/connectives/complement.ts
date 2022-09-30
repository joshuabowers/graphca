import { _ } from '@arrows/multimethod'
import { Writer, unit } from "../../monads/writer"
import { Clades, Genera, Species, isSpecies, isGenus } from "../../utility/tree"
import { Real, Complex, Boolean, boolean } from "../../primitives"
import { Unary, unary, when } from "../../closures/unary"
import { Conjunction, and } from './conjunction'
import { Disjunction, or } from './disjunction'
import { ExclusiveDisjunction, xor } from './exclusiveDisjunction'
import { Implication } from './implication'
import { AlternativeDenial, nand } from './alternativeDenial'
import { JointDenial, nor } from './jointDenial'
import { Biconditional, xnor } from './biconditional'
import { ConverseImplication } from './converseImplication'

export type Complement = Unary<Species.not, Genera.connective>

export const [not, isComplement, $not] = unary<Complement, Boolean>(
  Species.not, Genera.connective
)(
  r => [boolean(r.value === 0), 'real complement'],
  c => [boolean(c.a === 0 && c.b === 0), 'complex complement'],
  b => [boolean(!b.value), 'boolean complement']
)(
  // NOTE: Cannot use derived isSpecies guards as they are not defined
  // by this point.
  when<Complement>(
    isSpecies(Species.not), v => [v.expression, 'double complement']
  ),
  when<Conjunction>(
    isSpecies(Species.and), 
    v => [nand(v.left, v.right), 'complement of conjunction']
  ),
  when<Disjunction>(
    isSpecies(Species.or), 
    v => [nor(v.left, v.right), 'complement of disjunction']
  ),
  when<AlternativeDenial>(
    isSpecies(Species.nand), 
    v => [and(v.left, v.right), 'complement of alternative denial']
  ),
  when<JointDenial>(
    isSpecies(Species.nor), 
    v => [or(v.left, v.right), 'complement of joint denial']
  ),
  when<ExclusiveDisjunction>(
    isSpecies(Species.xor), 
    v => [xnor(v.left, v.right), 'complement of exclusive disjunction']
  ),
  when<Implication>(
    isSpecies(Species.implies),
    v => [and(v.left, not(v.right)), 'complement of implication']
  ),
  when<Biconditional>(
    isSpecies(Species.xnor),
    v => [xor(v.left, v.right), 'complement of biconditional']
  ),
  when<ConverseImplication>(
    isSpecies(Species.converse),
    v => [and(not(v.left), v.right), 'complement of converse implication']
  )
)
