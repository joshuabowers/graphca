import { Kind, Addition, Multiplication } from './Expression'
import { real } from './real'
import { complex } from './complex'
import { variable } from './var'
import { add, subtract } from './addition'
import { double, multiply } from './multiplication'

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

  describe('with the same object twice', () => {
    it('replaces the addition with a multiplication', () => {
      expect(add(variable('x'), variable('x'))).toEqual(double(variable('x')))
    })
  })

  describe('with {X, Y}, X', () => {
    it('replaces the nested addition with an addition of a multiplication', () => {
      expect(
        add(add(variable('x'), real(1)), variable('x'))
      ).toEqual(add(double(variable('x')), real(1)))
    })
  })

  describe('with {Y, X}, X', () => {
    it('replaces the nested addition with an addition of a multiplication', () => {
      expect(
        add(add(variable('y'), variable('x')), variable('x'))
      ).toEqual(add(double(variable('x')), variable('y')))
    })
  })

  describe('with X, {X, Y}', () => {
    it('replaces the nested addition and an addition of a multiplication', () => {
      expect(
        add(variable('x'), add(variable('x'), variable('y')))
      ).toEqual(add(double(variable('x')), variable('y')))
    })
  })

  describe('with X, {Y, X}', () => {
    it('replaces the nested addition with an addition of a multiplication', () => {
      expect(
        add(variable('x'), add(variable('y'), variable('x')))
      ).toEqual(add(double(variable('x')), variable('y')))
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
})