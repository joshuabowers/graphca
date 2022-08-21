import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { Addition, add, subtract } from './addition'
import { Multiplication, double, multiply } from './multiplication'

describe('add', () => {
  describe('with Real, Real', () => {
    it('returns a real valued at the addition', () => {
      expect(add(real(1), real(2))).toEqual(real(3))
    })
  })

  describe('with Complex, Complex', () => {
    it('returns the pairwise addition of the values', () => {
      expect(add(complex(1, 2), complex(2, 3))).toEqual(complex(3, 5))
    })
  })

  describe('with Complex, Real', () => {
    it('adds the real to the real part of the complex', () => {
      expect(add(complex(1, 2), real(2))).toEqual(complex(3, 2))
    })
  })

  describe('with Real, Complex', () => {
    it('adds the real to the real part of the complex', () => {
      expect(add(real(2), complex(1, 2))).toEqual(complex(3, 2))
    })
  })

  describe('with 0, Anything', () => {
    it('returns the right parameter', () => {
      expect(add(real(0), variable('x'))).toEqual(variable('x'))
    })
  })

  describe('with Anything, 0', () => {
    it('returns the left parameter', () => {
      expect(add(variable('x'), real(0))).toEqual(variable('x'))
    })
  })

  describe('with Real, Anything', () => {
    it('flips the order of the addends', () => {
      expect(add(real(1), variable('x'))).toEqual(add(variable('x'), real(1)))
    })
  })

  describe('with Complex, Anything', () => {
    it('flips the order of the addends', () => {
      expect(add(complex(1, 2), variable('x'))).toEqual(add(variable('x'), complex(1, 2)))
    })
  })

  describe('with {X + 1} + 2', () => {
    it('replaces with a single addition', () => {
      expect(add(add(variable('x'), real(1)), real(2))).toEqual(add(variable('x'), real(3)))
    })
  })

  describe('with {1 + x} + 2', () => {
    it('replaces with a single addition', () => {
      expect(add(add(real(1), variable('x')), real(2))).toEqual(add(variable('x'), real(3)))
    })
  })

  describe('with 2 + {X + 1}', () => {
    it('replaces with a single addition', () => {
      expect(add(real(2), add(variable('x'), real(1)))).toEqual(add(variable('x'), real(3)))
    })
  })

  describe('with 2 + {1 + X}', () => {
    it('replaces with a single addition', () => {
      expect(add(real(2), add(real(1), variable('x')))).toEqual(add(variable('x'), real(3)))
    })
  })

  describe('with {X + 1} + i', () => {
    it('replaces with a single addition', () => {
      expect(add(add(variable('x'), real(1)), complex(0, 1))).toEqual(add(variable('x'), complex(1, 1)))
    })
  })

  describe('with the same object twice', () => {
    it('replaces the addition with a multiplication', () => {
      expect(add(variable('x'), variable('x'))).toEqual(double(variable('x')))
    })
  })

  describe('with {X + Y}, X', () => {
    it('replaces the nested addition with an addition of a multiplication', () => {
      expect(
        add(add(variable('x'), real(1)), variable('x'))
      ).toEqual(add(double(variable('x')), real(1)))
    })
  })

  describe('with {Y + X}, X', () => {
    it('replaces the nested addition with an addition of a multiplication', () => {
      expect(
        add(add(variable('y'), variable('x')), variable('x'))
      ).toEqual(add(double(variable('x')), variable('y')))
    })
  })

  describe('with X, {X + Y}', () => {
    it('replaces the nested addition and an addition of a multiplication', () => {
      expect(
        add(variable('x'), add(variable('x'), variable('y')))
      ).toEqual(add(double(variable('x')), variable('y')))
    })
  })

  describe('with X, {Y + X}', () => {
    it('replaces the nested addition with an addition of a multiplication', () => {
      expect(
        add(variable('x'), add(variable('y'), variable('x')))
      ).toEqual(add(double(variable('x')), variable('y')))
    })
  })

  describe('with {X * Y}, X', () => {
    it('replaces the addition with a multiplication of an addition', () => {
      expect(
        add(multiply(variable('x'), variable('y')), variable('x'))
      ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
    })
  })

  describe('with {Y * X}, X', () => {
    it('replaces the addition with a multiplication of an addition', () => {
      expect(
        add(multiply(variable('y'), variable('x')), variable('x'))
      ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
    })
  })

  describe('with X, {X * Y}', () => {
    it('replaces the addition with a multiplication of an addition', () => {
      expect(
        add(variable('x'), multiply(variable('x'), variable('y')))
      ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
    })
  })

  describe('with X, {Y * X}', () => {
    it('replaces the addition with a multiplication of an addition', () => {
      expect(
        add(variable('x'), multiply(variable('y'), variable('x')))
      ).toEqual(multiply(add(variable('y'), real(1)), variable('x')))
    })
  })

  describe('with {X * Z}, {Y * Z}', () => {
    it('factors out z as a multiplication', () => {
      expect(
        add(multiply(variable('x'), variable('z')), multiply(variable('y'), variable('z')))
      ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
    })
  })

  describe('with {Z * X}, {Y * Z}', () => {
    it('factors out z as a multiplication', () => {
      expect(
        add(multiply(variable('z'), variable('x')), multiply(variable('y'), variable('z')))
      ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
    })
  })

  describe('with {X * Z}, {Z * Y}', () => {
    it('factors out z as a multiplication', () => {
      expect(
        add(multiply(variable('x'), variable('z')), multiply(variable('z'), variable('y')))
      ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
    })
  })

  describe('with {Z * X}, {Z * Y}', () => {
    it('factors out z as a multiplication', () => {
      expect(
        add(multiply(variable('z'), variable('x')), multiply(variable('z'), variable('y')))
      ).toEqual(multiply(add(variable('x'), variable('y')), variable('z')))
    })
  })

  describe('with {2 * X}, {X * 3}', () => {
    it('combines like terms', () => {
      expect(
        add(multiply(real(2), variable('x')), multiply(variable('x'), real(3)))
      ).toEqual(multiply(real(5), variable('x')))
    })
  })

  describe('when adding a complex to itself', () => {
    it('results in a doubled complex', () => {
      expect(add(complex(0, 1), complex(0, 1))).toEqual(complex(0, 2))
    })
  })

  describe('when adding a real to a complex', () => {
    it('calculates a complex value correctly', () => {
      expect(add(complex(2, 1), real(1))).toEqual(complex(3, 1))
    })
  })

  describe('when unable to fully evaluate', () => {
    it('returns an addition expression', () => {
      expect(add(variable('x'), real(1))).toEqual(new Addition(variable('x'), real(1)))
    })
  })
})

describe('subtract', () => {
  it('returns an addition of a negated right', () => {
    expect(subtract(variable('x'), real(1))).toEqual(new Addition(variable('x'), real(-1)))
  })

  it('returns the negated right when subtracting from zero', () => {
    expect(subtract(real(0), variable('x'))).toEqual(new Multiplication(real(-1), variable('x')))
  })

  it('returns the subtraction of reals', () => {
    expect(subtract(real(4), real(1))).toEqual(real(3))
  })

  it('returns 0 if subtracting a quantity from itself', () => {
    expect(subtract(variable('x'), variable('x'))).toEqual(real(0))
  })

  it('returns 0 if subtracting a complex from itself', () => {
    expect(subtract(complex(0, 1), complex(0, 1))).toEqual(complex(0, 0))
  })

  it('properly subtracts a real from a complex', () => {
    expect(subtract(complex(2, 1), real(1))).toEqual(complex(1, 1))
  })

  it('combines like terms across multiplications', () => {
    expect(
      subtract(
        multiply(multiply(variable('a'), variable('b')), variable('c')),
        multiply(multiply(variable('d'), variable('b')), variable('c'))
      )
    ).toEqual(
      multiply(
        multiply(subtract(variable('a'), variable('d')), variable('b')),
        variable('c')
      )
    )
  })
})
