import { _ } from '@arrows/multimethod'
import { Genera, Species, Notation, isSpecies } from "../../utility/tree"
import { Boolean, boolean } from "../../primitives"
import { Unary, unary, unaryFnRule, when } from "../../closures/unary"
import { Conjunction, and, andRule } from './conjunction'
import { Disjunction, or, orRule } from './disjunction'
import { ExclusiveDisjunction, xor, xorRule } from './exclusiveDisjunction'
import { Implication } from './implication'
import { AlternativeDenial, nand, nandRule } from './alternativeDenial'
import { JointDenial, nor, norRule } from './jointDenial'
import { Biconditional, xnor, xnorRule } from './biconditional'
import { ConverseImplication } from './converseImplication'
import { Unicode } from '../../Unicode'
import { rule } from '../../utility/rule'

export type Complement = Unary<Species.not, Genera.connective>

export const notRule = unaryFnRule(Unicode.not)

export const [not, isComplement, $not] = unary<Complement, Boolean>(
  Unicode.not, Notation.prefix, Species.not, Genera.connective
)(
  r => [boolean(r.value === 0), notRule(r), 'real complement'],
  c => [boolean(c.a === 0 && c.b === 0), notRule(c), 'complex complement'],
  b => [boolean(!b.value), notRule(b), 'boolean complement']
)(
  // NOTE: Cannot use derived isSpecies guards as they are not defined
  // by this point.
  when<Complement>(
    isSpecies(Species.not), 
    v => [v.expression, rule`${v.expression}`, 'double complement']
  ),
  when<Conjunction>(
    isSpecies(Species.and), 
    v => [nand(v.left, v.right), nandRule(v.left, v.right), 'complement of conjunction']
  ),
  when<Disjunction>(
    isSpecies(Species.or), 
    v => [nor(v.left, v.right), norRule(v.left, v.right), 'complement of disjunction']
  ),
  when<AlternativeDenial>(
    isSpecies(Species.nand), 
    v => [and(v.left, v.right), andRule(v.left, v.right), 'complement of alternative denial']
  ),
  when<JointDenial>(
    isSpecies(Species.nor), 
    v => [or(v.left, v.right), orRule(v.left, v.right), 'complement of joint denial']
  ),
  when<ExclusiveDisjunction>(
    isSpecies(Species.xor), 
    v => [xnor(v.left, v.right), xnorRule(v.left, v.right), 'complement of exclusive disjunction']
  ),
  when<Implication>(
    isSpecies(Species.implies),
    v => [
      and(v.left, not(v.right)), 
      rule`${v.left} ${Unicode.and} (${v.right})${Unicode.not}`, 
      'complement of implication'
    ]
  ),
  when<Biconditional>(
    isSpecies(Species.xnor),
    v => [xor(v.left, v.right), xorRule(v.left, v.right), 'complement of biconditional']
  ),
  when<ConverseImplication>(
    isSpecies(Species.converse),
    v => [
      and(not(v.left), v.right), 
      rule`(${v.left})${Unicode.not} ${Unicode.and} ${v.right}`,
      'complement of converse implication'
    ]
  )
)
