import { real } from './real'
import { complex } from './complex'
import { bool } from './boolean'
import { variable } from './variable'
import {
  Conjunction, Disjunction, ExclusiveDisjunction, Implication,
  AlternativeDenial, JointDenial, Biconditional, ConverseImplication,
  and, or, xor, implies,
  nand, nor, xnor, converse
} from './connective'

describe('and', () => {
  it('returns true when given two true things', () => {
    expect(and(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns false if the left argument is false', () => {
    expect(and(bool(false), bool(true))).toEqual(bool(false))
  })

  it('returns false if the right argument is false', () => {
    expect(and(bool(true), bool(false))).toEqual(bool(false))
  })

  it('returns false if both arguments are false', () => {
    expect(and(bool(false), bool(false))).toEqual(bool(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(and(real(5), real(0))).toEqual(bool(false))
  })

  it('casts complexes to booleans, 0 => false, non-0 => true', () => {
    expect(and(complex(5,0), complex(0,0))).toEqual(bool(false))
  })

  it('returns the left operand if the right is true', () => {
    expect(and(variable('x'), bool(true))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is true', () => {
    expect(and(bool(true), variable('x'))).toEqual(variable('x'))
  })

  it('returns the false if the right operand is false', () => {
    expect(and(variable('x'), bool(false))).toEqual(bool(false))
  })

  it('returns false if the left operand is false', () => {
    expect(and(bool(false), variable('x'))).toEqual(bool(false))
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

  it('returns a Conjunction on variable input', () => {
    expect(and(variable('x'), variable('y'))).toEqual(
      new Conjunction(variable('x'), variable('y'))
    )
  })
})

describe('or', () => {
  it('returns true when given two true things', () => {
    expect(or(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns true if the left argument is true', () => {
    expect(or(bool(true), bool(false))).toEqual(bool(true))
  })

  it('returns true if the right argument is true', () => {
    expect(or(bool(false), bool(true))).toEqual(bool(true))
  })

  it('returns false if both arguments are false', () => {
    expect(or(bool(false), bool(false))).toEqual(bool(false))
  })

  it('casts reals to booleans, where 0 is false, non-zero is true', () => {
    expect(or(real(5), real(0))).toEqual(bool(true))
  })

  it('casts complexes to booleans, 0 => false, non-zero => true', () => {
    expect(or(complex(5,0), complex(0,0))).toEqual(bool(true))
  })

  it('returns the left operand if the right is false', () => {
    expect(or(variable('x'), bool(false))).toEqual(variable('x'))
  })

  it('returns the right operand if the left is false', () => {
    expect(or(bool(false), variable('x'))).toEqual(variable('x'))
  })

  it('returns true if the right operand is true', () => {
    expect(or(variable('x'), bool(true))).toEqual(bool(true))
  })

  it('returns true if the left operand is true', () => {
    expect(or(bool(true), variable('x'))).toEqual(bool(true))
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

  it('returns a Disjunction on variable input', () => {
    expect(or(variable('x'), variable('y'))).toEqual(
      new Disjunction(variable('x'), variable('y'))
    )
  })
})

describe('xor', () => {
  it('returns false when given two true things', () => {
    expect(xor(bool(true), bool(true))).toEqual(bool(false))
  })

  it('returns true if the left argument is false', () => {
    expect(xor(bool(false), bool(true))).toEqual(bool(true))
  })

  it('returns true if the right argument is false', () => {
    expect(xor(bool(true), bool(false))).toEqual(bool(true))
  })

  it('returns false if both arguments are false', () => {
    expect(xor(bool(false), bool(false))).toEqual(bool(false))
  })

  it('returns a ExclusiveDisjunction on variable input', () => {
    expect(xor(variable('x'), variable('y'))).toEqual(
      new ExclusiveDisjunction(variable('x'), variable('y'))
    )
  })  
})

describe('implies', () => {
  it('returns true when given two true things', () => {
    expect(implies(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns true if the left argument is false', () => {
    expect(implies(bool(false), bool(true))).toEqual(bool(true))
  })

  it('returns false if the right argument is false', () => {
    expect(implies(bool(true), bool(false))).toEqual(bool(false))
  })

  it('returns true if both arguments are false', () => {
    expect(implies(bool(false), bool(false))).toEqual(bool(true))
  })
  
  it('returns an Implication on variable input', () => {
    expect(implies(variable('x'), variable('y'))).toEqual(
      new Implication(variable('x'), variable('y'))
    )
  })
})

describe('nand', () => {
  it('returns false when given two true things', () => {
    expect(nand(bool(true), bool(true))).toEqual(bool(false))
  })

  it('returns true if the left argument is false', () => {
    expect(nand(bool(false), bool(true))).toEqual(bool(true))
  })

  it('returns true if the right argument is false', () => {
    expect(nand(bool(true), bool(false))).toEqual(bool(true))
  })

  it('returns true if both arguments are false', () => {
    expect(nand(bool(false), bool(false))).toEqual(bool(true))
  })

  it('returns a AlternativeDenial on variable input', () => {
    expect(nand(variable('x'), variable('y'))).toEqual(
      new AlternativeDenial(variable('x'), variable('y'))
    )
  })
})

describe('nor', () => {
  it('returns false when given two true things', () => {
    expect(nor(bool(true), bool(true))).toEqual(bool(false))
  })

  it('returns false if the left argument is false', () => {
    expect(nor(bool(false), bool(true))).toEqual(bool(false))
  })

  it('returns false if the right argument is false', () => {
    expect(nor(bool(true), bool(false))).toEqual(bool(false))
  })

  it('returns true if both arguments are false', () => {
    expect(nor(bool(false), bool(false))).toEqual(bool(true))
  })

  it('returns a JointDenial on variable input', () => {
    expect(nor(variable('x'), variable('y'))).toEqual(
      new JointDenial(variable('x'), variable('y'))
    )
  })
})

describe('xnor', () => {
  it('returns true when given two true things', () => {
    expect(xnor(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns false if the left argument is false', () => {
    expect(xnor(bool(false), bool(true))).toEqual(bool(false))
  })

  it('returns false if the right argument is false', () => {
    expect(xnor(bool(true), bool(false))).toEqual(bool(false))
  })

  it('returns true if both arguments are false', () => {
    expect(xnor(bool(false), bool(false))).toEqual(bool(true))
  })

  it('returns a Biconditional on variable input', () => {
    expect(xnor(variable('x'), variable('y'))).toEqual(
      new Biconditional(variable('x'), variable('y'))
    )
  })
})

describe('converse', () => {
  it('returns true when given two true things', () => {
    expect(converse(bool(true), bool(true))).toEqual(bool(true))
  })

  it('returns false if the left argument is false', () => {
    expect(converse(bool(false), bool(true))).toEqual(bool(false))
  })

  it('returns true if the right argument is false', () => {
    expect(converse(bool(true), bool(false))).toEqual(bool(true))
  })

  it('returns true if both arguments are false', () => {
    expect(converse(bool(false), bool(false))).toEqual(bool(true))
  })

  it('returns a ConverseImplication on variable input', () => {
    expect(converse(variable('x'), variable('y'))).toEqual(
      new ConverseImplication(variable('x'), variable('y'))
    )
  })
})
