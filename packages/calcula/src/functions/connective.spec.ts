import { expectWriter } from '../utility/expectations'
import { Clades, Genera, Species } from '../utility/tree'
import { real, complex, boolean } from '../primitives'
import { variable } from '../variable'
import {
  LogicalComplement,
  Conjunction, Disjunction, ExclusiveDisjunction, Implication,
  AlternativeDenial, JointDenial, Biconditional, ConverseImplication,
  not,
  and, or, xor, implies,
  nand, nor, xnor, converse
} from './connective'

describe('not', () => {
  it('yields false for non-zero real inputs', () => {
    expect(not(real(5))).toEqual(boolean(false))
  })

  it('yields true for a real value of zero', () => {
    expect(not(real(0))).toEqual(boolean(true))
  })

  it('yields false for non-zero complex inputs', () => {
    expect(not(complex([1, 0]))).toEqual(boolean(false))
  })

  it('yields true for complex 0', () => {
    expect(not(complex([0, 0]))).toEqual(boolean(true))
  })

  it('yields false for a true input', () => {
    expect(not(boolean(true))).toEqual(boolean(false))
  })

  it('yields true for a false input', () => {
    expect(not(boolean(false))).toEqual(boolean(true))
  })

  it('yields a logical complement for variable input', () => {
    // expect(not(variable('x'))).toEqual(new LogicalComplement(variable('x')))
    expectWriter(not(variable('x')))(
      {
        clade: Clades.unary, genus: Genera.connective, species: Species.not,
        expression: variable('x')
      } as LogicalComplement
    )
  })

  it('rewrites double negations as the inner expression', () => {
    expect(not(not(variable('x')))).toEqual(variable('x'))
  })

  it('returns an alternative denial when given a conjunction', () => {
    expect(
      not(and(variable('x'), variable('y')))
    ).toEqual(nand(variable('x'), variable('y')))
  })

  it('returns a conjunction if given an alternative denial', () => {
    expect(
      not(nand(variable('x'), variable('y')))
    ).toEqual(and(variable('x'), variable('y')))
  })

  it('returns a joint denial if given a disjunction', () => {
    expect(
      not(or(variable('x'), variable('y')))
    ).toEqual(nor(variable('x'), variable('y')))
  })

  it('returns a disjunction if given a joint denial', () => {
    expect(
      not(nor(variable('x'), variable('y')))
    ).toEqual(or(variable('x'), variable('y')))
  })

  it('returns a biconditional if given an exclusive disjunction', () => {
    expect(
      not(xor(variable('x'), variable('y')))
    ).toEqual(xnor(variable('x'), variable('y')))
  })

  it('returns a conjunction if given an implication', () => {
    expect(
      not(implies(variable('x'), variable('y')))
    ).toEqual(and(variable('x'), not(variable('y'))))
  })

  it('returns an exclusive disjunction if given a biconditional', () => {
    expect(
      not(xnor(variable('x'), variable('y')))
    ).toEqual(xor(variable('x'), variable('y')))
  })

  it('returns a conjunction if given a converse implication', () => {
    expect(
      not(converse(variable('x'), variable('y')))
    ).toEqual(and(not(variable('x')), variable('y')))
  })
})

describe('and', () => {
  it('returns true when given two true things', () => {
    expect(and(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the left argument is false', () => {
    expect(and(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the right argument is false', () => {
    expect(and(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns false if both arguments are false', () => {
    expect(and(boolean(false), boolean(false))).toEqual(boolean(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(and(real(5), real(0))).toEqual(boolean(false))
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expect(and(complex([5,0]), complex([0,0]))).toEqual(boolean(false))
  })

  it('returns the left operand if the right is true', () => {
    expect(and(variable('x'), boolean(true))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is true', () => {
    expect(and(boolean(true), variable('x'))).toEqual(variable('x'))
  })

  it('returns the false if the right operand is false', () => {
    expect(and(variable('x'), boolean(false))).toEqual(boolean(false))
  })

  it('returns false if the left operand is false', () => {
    expect(and(boolean(false), variable('x'))).toEqual(boolean(false))
  })

  it('returns the left operand if left equivalent to right', () => {
    expect(and(variable('x'), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is a Disjunction of the left', () => {
    expect(and(variable('x'), or(variable('x'), variable('y')))).toEqual(variable('x'))
    expect(and(variable('x'), or(variable('y'), variable('x')))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is a Disjunction of the right', () => {
    expect(and(or(variable('x'), variable('y')), variable('x'))).toEqual(variable('x'))
    expect(and(or(variable('y'), variable('x')), variable('x'))).toEqual(variable('x'))
  })

  it('returns false if the right operand is the negation of the left', () => {
    expect(and(variable('x'), not(variable('x')))).toEqual(boolean(false))
  })

  it('returns false if the left operand is the negation of the right', () => {
    expect(and(not(variable('x')), variable('x'))).toEqual(boolean(false))
  })

  it('returns a Conjunction on variable input', () => {
    expectWriter(and(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.and,
        left: variable('x'), right: variable('y')
      } as Conjunction,
      [[variable('x').value, variable('y').value], 'conjunction']
    )
  })
})

describe('or', () => {
  it('returns true when given two true things', () => {
    expect(or(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left argument is true', () => {
    expect(or(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if the right argument is true', () => {
    expect(or(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if both arguments are false', () => {
    expect(or(boolean(false), boolean(false))).toEqual(boolean(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(or(real(5), real(0))).toEqual(boolean(true))
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expect(or(complex([5,0]), complex([0,0]))).toEqual(boolean(true))
  })

  it('returns the left operand if the right is false', () => {
    expect(or(variable('x'), boolean(false))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is false', () => {
    expect(or(boolean(false), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is true', () => {
    expect(or(variable('x'), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left operand is true', () => {
    expect(or(boolean(true), variable('x'))).toEqual(boolean(true))
  })

  it('returns the left operand if left is equivalent to right', () => {
    expect(or(variable('x'), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is a Conjunction of the left', () => {
    expect(or(variable('x'), and(variable('x'), variable('y')))).toEqual(variable('x'))
    expect(or(variable('x'), and(variable('y'), variable('x')))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is a Conjunction of the right', () => {
    expect(or(and(variable('x'), variable('y')), variable('x'))).toEqual(variable('x'))
    expect(or(and(variable('y'), variable('x')), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is the negation of the left', () => {
    expect(or(variable('x'), not(variable('x')))).toEqual(boolean(true))
  })

  it('returns true if the left operand is the negation of the right', () => {
    expect(or(not(variable('x')), variable('x'))).toEqual(boolean(true))
  })

  it('returns an implication if the left operand is a complement', () => {
    expect(
      or(not(variable('x')), variable('y'))
    ).toEqual(implies(variable('x'), variable('y')))
  })

  it('returns a converse if the right operand is a complement', () => {
    expect(
      or(variable('x'), not(variable('y')))
    ).toEqual(converse(variable('x'), variable('y')))
  })

  it('returns a Disjunction on variable input', () => {
    expectWriter(or(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.or,
        left: variable('x'), right: variable('y')
      } as Disjunction,
      [[variable('x').value, variable('y').value], 'disjunction']
    )
  })
})

describe('xor', () => {
  it('returns false when given two true things', () => {
    expect(xor(boolean(true), boolean(true))).toEqual(boolean(false))
  })

  it('returns true if the left argument is false', () => {
    expect(xor(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the right argument is false', () => {
    expect(xor(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns false if both arguments are false', () => {
    expect(xor(boolean(false), boolean(false))).toEqual(boolean(false))
  })

  it('returns the right operand if the left is false', () => {
    expect(xor(boolean(false), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is false', () => {
    expect(xor(variable('x'), boolean(false))).toEqual(variable('x'))
  })

  it('returns the complement of the right if the left is true', () => {
    expect(xor(boolean(true), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns the complement of the left if the right is true', () => {
    expect(xor(variable('x'), boolean(true))).toEqual(not(variable('x')))
  })

  it('returns false if the left and right operands are equal', () => {
    expect(xor(variable('x'), variable('x'))).toEqual(boolean(false))
  })

  it('returns a ExclusiveDisjunction on variable input', () => {
    expectWriter(xor(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.xor,
        left: variable('x'), right: variable('y')
      } as ExclusiveDisjunction,
      [[variable('x').value, variable('y').value], 'exclusive disjunction']
    )
  })  
})

describe('implies', () => {
  it('returns true when given two true things', () => {
    expect(implies(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left argument is false', () => {
    expect(implies(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the right argument is false', () => {
    expect(implies(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns true if both arguments are false', () => {
    expect(implies(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the right operand if the left is true', () => {
    expect(implies(boolean(true), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is true', () => {
    expect(implies(variable('x'), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the left operand is false', () => {
    expect(implies(boolean(false), variable('x'))).toEqual(boolean(true))
  })

  it('returns the complement of the left if the right is false', () => {
    expect(implies(variable('x'), boolean(false))).toEqual(not(variable('x')))
  })
  
  it('returns an Implication on variable input', () => {
    expectWriter(implies(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.implies,
        left: variable('x'), right: variable('y')
      } as Implication,
      [[variable('x').value, variable('y').value], 'implication']
    )
  })
})

describe('nand', () => {
  it('returns false when given two true things', () => {
    expect(nand(boolean(true), boolean(true))).toEqual(boolean(false))
  })

  it('returns true if the left argument is false', () => {
    expect(nand(boolean(false), boolean(true))).toEqual(boolean(true))
  })

  it('returns true if the right argument is false', () => {
    expect(nand(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if both arguments are false', () => {
    expect(nand(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the complement of left operand if the right is true', () => {
    expect(nand(variable('x'), boolean(true))).toEqual(not(variable('x')))
  })

  it('returns the right operand if the left is true', () => {
    expect(nand(boolean(true), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns the true if the right operand is false', () => {
    expect(nand(variable('x'), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if the left operand is false', () => {
    expect(nand(boolean(false), variable('x'))).toEqual(boolean(true))
  })

  it('returns the complement of the left operand if left equivalent to right', () => {
    expect(nand(variable('x'), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns an implication if the right operand is a nand of the left', () => {
    expect(
      nand(variable('x'), nand(variable('x'), variable('y')))
    ).toEqual(implies(variable('x'), variable('y')))
    expect(
      nand(variable('x'), nand(variable('y'), variable('x')))
    ).toEqual(implies(variable('x'), variable('y')))
  })

  it('returns a disjunction of mutually complemented operands', () => {
    expect(
      nand(not(variable('x')), not(variable('y')))
    ).toEqual(or(variable('x'), variable('y')))
  })

  it('returns true if the right operand is the complement of the left', () => {
    expect(nand(variable('x'), not(variable('x')))).toEqual(boolean(true))
  })

  it('returns true if the left operand is the complement of the right', () => {
    expect(nand(not(variable('x')), variable('x'))).toEqual(boolean(true))
  })

  it('returns a AlternativeDenial on variable input', () => {
    expectWriter(nand(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.nand,
        left: variable('x'), right: variable('y')
      } as AlternativeDenial,
      [[variable('x').value, variable('y').value], 'alternative denial']
    )
  })
})

describe('nor', () => {
  it('returns false when given two true things', () => {
    expect(nor(boolean(true), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the left argument is false', () => {
    expect(nor(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the right argument is false', () => {
    expect(nor(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns true if both arguments are false', () => {
    expect(nor(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the complement of the left operand if the right is false', () => {
    expect(nor(variable('x'), boolean(false))).toEqual(not(variable('x')))
  })

  it('returns the complement of the right operand if the left is false', () => {
    expect(nor(boolean(false), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns false if the right operand is true', () => {
    expect(nor(variable('x'), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the left operand is true', () => {
    expect(nor(boolean(true), variable('x'))).toEqual(boolean(false))
  })

  it('returns the complement of the left operand if left is equivalent to right', () => {
    expect(nor(variable('x'), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns a conjunction of mutually complemented operands', () => {
    expect(
      nor(not(variable('x')), not(variable('y')))
    ).toEqual(and(variable('x'), variable('y')))
  })

  it('returns false if the right operand is the complement of the left', () => {
    expect(nor(variable('x'), not(variable('x')))).toEqual(boolean(false))
  })

  it('returns false if the left operand is the complement of the right', () => {
    expect(nor(not(variable('x')), variable('x'))).toEqual(boolean(false))
  })

  it('returns a JointDenial on variable input', () => {
    expectWriter(nor(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.nor,
        left: variable('x'), right: variable('y')
      } as JointDenial,
      [[variable('x').value, variable('y').value], 'joint denial']
    )
  })
})

describe('xnor', () => {
  it('returns true when given two true things', () => {
    expect(xnor(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the left argument is false', () => {
    expect(xnor(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns false if the right argument is false', () => {
    expect(xnor(boolean(true), boolean(false))).toEqual(boolean(false))
  })

  it('returns true if both arguments are false', () => {
    expect(xnor(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns the right operand if the left is true', () => {
    expect(xnor(boolean(true), variable('x'))).toEqual(variable('x'))
  })

  it('returns the left operand if the right is true', () => {
    expect(xnor(variable('x'), boolean(true))).toEqual(variable('x'))
  })

  it('returns the complement of the right if the left is false', () => {
    expect(xnor(boolean(false), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns the complement of the left if the right is false', () => {
    expect(xnor(variable('x'), boolean(false))).toEqual(not(variable('x')))
  })

  it('returns true if the operands are equal', () => {
    expect(xnor(variable('x'), variable('x'))).toEqual(boolean(true))
  })

  it('returns a Biconditional on variable input', () => {
    expectWriter(xnor(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.xnor,
        left: variable('x'), right: variable('y')
      } as Biconditional,
      [[variable('x').value, variable('y').value], 'biconditional']
    )
  })
})

describe('converse', () => {
  it('returns true when given two true things', () => {
    expect(converse(boolean(true), boolean(true))).toEqual(boolean(true))
  })

  it('returns false if the left argument is false', () => {
    expect(converse(boolean(false), boolean(true))).toEqual(boolean(false))
  })

  it('returns true if the right argument is false', () => {
    expect(converse(boolean(true), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if both arguments are false', () => {
    expect(converse(boolean(false), boolean(false))).toEqual(boolean(true))
  })

  it('returns true if the left operand is true', () => {
    expect(converse(boolean(true), variable('x'))).toEqual(boolean(true))
  })

  it('returns the left operand if the right is true', () => {
    expect(converse(variable('x'), boolean(true))).toEqual(variable('x'))
  })

  it('returns the complement of the right if the left is false', () => {
    expect(converse(boolean(false), variable('x'))).toEqual(not(variable('x')))
  })

  it('returns true if the right operand is false', () => {
    expect(converse(variable('x'), boolean(false))).toEqual(boolean(true))
  })

  it('returns a ConverseImplication on variable input', () => {
    expectWriter(converse(variable('x'), variable('y')))(
      {
        clade: Clades.binary, genus: Genera.connective, species: Species.converse,
        left: variable('x'), right: variable('y')
      } as ConverseImplication,
      [[variable('x').value, variable('y').value], 'converse implication']
    )
  })
})
