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
  nand, nor, xnor, converse,
  $not
} from './connective'

describe('not', () => {
  it('yields false for non-zero real inputs', () => {
    expectWriter(
      not(real(5))
    )(
      boolean(false),
      [real(5), 'real complement']
    )
  })

  it('yields true for a real value of zero', () => {
    expectWriter(
      not(real(0))
    )(
      boolean(true),
      [real(0), 'real complement']
    )
  })

  it('yields false for non-zero complex inputs', () => {
    expectWriter(
      not(complex([1, 0]))
    )(
      boolean(false),
      [complex([1, 0]), 'complex complement']
    )
  })

  it('yields true for complex 0', () => {
    expectWriter(
      not(complex([0, 0]))
    )(
      boolean(true),
      [complex([0, 0]), 'complex complement']
    )
  })

  it('yields false for a true input', () => {
    expectWriter(
      not(boolean(true))
    )(
      boolean(false),
      [boolean(true), 'boolean complement']
    )
  })

  it('yields true for a false input', () => {
    expectWriter(
      not(boolean(false))
    )(
      boolean(true),
      [boolean(false), 'boolean complement']
    )
  })

  it('yields a logical complement for variable input', () => {
    expectWriter(
      not(variable('x'))
    )(
      $not(variable('x'))[0],
      [variable('x'), 'complement']
    )
  })

  it('rewrites double negations as the inner expression', () => {
    expectWriter(
      not(not(variable('x')))
    )(
      variable('x'),
      [variable('x'), 'complement'],
      [not(variable('x')), 'double complement']
    )
  })

  it('returns an alternative denial when given a conjunction', () => {
    expectWriter(
      not(and(variable('x'), variable('y')))
    )(
      nand(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'conjunction'],
      [and(variable('x'), variable('y')), 'complement of conjunction'],
      [[variable('x'), variable('y')], 'alternative denial']
    )
  })

  it('returns a conjunction if given an alternative denial', () => {
    expectWriter(
      not(nand(variable('x'), variable('y')))
    )(
      and(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'alternative denial'],
      [nand(variable('x'), variable('y')), 'complement of alternative denial'],
      [[variable('x'), variable('y')], 'conjunction']
    )
  })

  it('returns a joint denial if given a disjunction', () => {
    expectWriter(
      not(or(variable('x'), variable('y')))
    )(
      nor(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'disjunction'],
      [or(variable('x'), variable('y')), 'complement of disjunction'],
      [[variable('x'), variable('y')], 'joint denial']
    )
  })

  it('returns a disjunction if given a joint denial', () => {
    expectWriter(
      not(nor(variable('x'), variable('y')))
    )(
      or(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'joint denial'],
      [nor(variable('x'), variable('y')), 'complement of joint denial'],
      [[variable('x'), variable('y')], 'disjunction']
    )
  })

  it('returns a biconditional if given an exclusive disjunction', () => {
    expectWriter(
      not(xor(variable('x'), variable('y')))
    )(
      xnor(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'exclusive disjunction'],
      [xor(variable('x'), variable('y')), 'complement of exclusive disjunction'],
      [[variable('x'), variable('y')], 'biconditional']
    )
  })

  it('returns a conjunction if given an implication', () => {
    expectWriter(
      not(implies(variable('x'), variable('y')))
    )(
      and(variable('x'), not(variable('y'))),
      [[variable('x'), variable('y')], 'implication'],
      [implies(variable('x'), variable('y')), 'complement of implication'],
      [variable('y'), 'complement'],
      [[variable('x'), not(variable('y'))], 'conjunction']
    )
  })

  it('returns an exclusive disjunction if given a biconditional', () => {
    expectWriter(
      not(xnor(variable('x'), variable('y')))
    )(
      xor(variable('x'), variable('y')),
      [[variable('x'), variable('y')], 'biconditional'],
      [xnor(variable('x'), variable('y')), 'complement of biconditional'],
      [[variable('x'), variable('y')], 'exclusive disjunction']
    )
  })

  it('returns a conjunction if given a converse implication', () => {
    expectWriter(
      not(converse(variable('x'), variable('y')))
    )(
      and(not(variable('x')), variable('y')),
      [[variable('x'), variable('y')], 'converse implication'],
      [converse(variable('x'), variable('y')), 'complement of converse implication'],
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('y')], 'conjunction']
    )
  })
})

describe('and', () => {
  it('returns true when given two true things', () => {
    expectWriter(
      and(boolean(true), boolean(true))
    )(
      boolean(true),
      [[boolean(true), boolean(true)], 'conjunctive identity']
    )
  })

  it('returns false if the left argument is false', () => {
    expectWriter(
      and(boolean(false), boolean(true))
    )(
      boolean(false),
      [[boolean(false), boolean(true)], 'conjunctive identity']
    )
  })

  it('returns false if the right argument is false', () => {
    expectWriter(
      and(boolean(true), boolean(false))
    )(
      boolean(false),
      [[boolean(true), boolean(false)], 'conjunctive identity']
    )
  })

  it('returns false if both arguments are false', () => {
    expectWriter(
      and(boolean(false), boolean(false))
    )(
      boolean(false),
      [[boolean(false), boolean(false)], 'conjunctive annihilator']
    )
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expectWriter(
      and(real(5), real(0))
    )(
      boolean(false),
      [[real(5), real(0)], 'real conjunction']
    )
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expectWriter(
      and(complex([5,0]), complex([0,0]))
    )(
      boolean(false),
      [[complex([5, 0]), complex([0, 0])], 'complex conjunction']
    )
  })

  it('returns the left operand if the right is true', () => {
    expectWriter(
      and(variable('x'), boolean(true))
    )(
      variable('x'),
      [[variable('x'), boolean(true)], 'conjunctive identity']
    )
  })

  it('returns the right operand if the left is true', () => {
    expectWriter(
      and(boolean(true), variable('x'))
    )(
      variable('x'),
      [[boolean(true), variable('x')], 'conjunctive identity']
    )
  })

  it('returns the false if the right operand is false', () => {
    expectWriter(
      and(variable('x'), boolean(false))
    )(
      boolean(false),
      [[variable('x'), boolean(false)], 'conjunctive annihilator']
    )
  })

  it('returns false if the left operand is false', () => {
    expectWriter(
      and(boolean(false), variable('x'))
    )(
      boolean(false),
      [[boolean(false), variable('x')], 'conjunctive annihilator']
    )
  })

  it('returns the left operand if left equivalent to right', () => {
    expectWriter(
      and(variable('x'), variable('x'))
    )(
      variable('x'),
      [[variable('x'), variable('x')], 'conjunctive idempotency']
    )
  })

  // See (e.g.): https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
  // x | y | x or y | x and (x or y) | x and x | x and y | (x and x) or (x and y)
  // ----------------------------------------------------------------------------
  // F | F | F      | F              | F       | F       | F 
  // F | T | T      | F              | F       | F       | F
  // T | F | T      | T              | T       | F       | T
  // T | T | T      | T              | T       | T       | T
  it('returns the left operand if the right is a Disjunction of the left', () => {
    expectWriter(
      and(variable('x'), or(variable('x'), variable('y')))
    )(
      variable('x'),
      [[variable('x'), variable('y')], 'disjunction'],
      [[variable('x'), or(variable('x'), variable('y'))], 'conjunctive absorption']
    )
    expectWriter(
      and(variable('x'), or(variable('y'), variable('x')))
    )(
      variable('x'),
      [[variable('y'), variable('x')], 'disjunction'],
      [[variable('x'), or(variable('y'), variable('x'))], 'conjunctive absorption']
    )
  })

  it('returns the right operand if the left is a Disjunction of the right', () => {
    expectWriter(
      and(or(variable('x'), variable('y')), variable('x'))
    )(
      variable('x'),
      [[variable('x'), variable('y')], 'disjunction'],
      [[or(variable('x'), variable('y')), variable('x')], 'conjunctive absorption']
    )
    expectWriter(
      and(or(variable('y'), variable('x')), variable('x'))
    )(
      variable('x'),
      [[variable('y'), variable('x')], 'disjunction'],
      [[or(variable('y'), variable('x')), variable('x')], 'conjunctive absorption']
    )
  })

  it('returns false if the right operand is the negation of the left', () => {
    expectWriter(
      and(variable('x'), not(variable('x')))
    )(
      boolean(false),
      [variable('x'), 'complement'],
      [[variable('x'), not(variable('x'))], 'contradiction']
    )
  })

  it('returns false if the left operand is the negation of the right', () => {
    expectWriter(
      and(not(variable('x')), variable('x'))
    )(
      boolean(false),
      [variable('x'), 'complement'],
      [[not(variable('x')), variable('x')], 'contradiction']
    )
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
