import { Scope } from './Scope'
import { Node, Location } from 'pegase'

const somewhere: Location = {index: 0, line: 0, column: 0}

const num = (value: string): Node => {
  return {$label: 'REAL', value, $from: somewhere, $to: somewhere}
}

describe(Scope, () => {
  describe('size', () => {
    it('is 0 when there are no variables', () => {
      const s = new Scope()
      expect(s.size).toEqual(0)
    })

    it('equals the number of unique variables', () => {
      const s = new Scope()
      s.set('x', num('5'))
      s.set('y', num('10'))
      expect(s.size).toEqual(2)
    })

    it('does not count masks', () => {
      const s = new Scope()
      s.set('x', num('5'))
      s.set('x', num('10'))
      expect(s.size).toEqual(1)
    })

    it('decreases after a removeLast if the variable is removed', () => {
      const s = new Scope()
      s.set('x', num('5'))
      s.removeLast('x')
      expect(s.size).toEqual(0)
    })
  })

  describe(Scope.prototype.count, () => {
    it('returns 0 if the variable is not set', () => {
      const s = new Scope()
      expect(s.count('x')).toBe(0)
    })

    it('returns 1 if the variable has only a single value', () => {
      const s = new Scope()
      s.set('x', num('5'))
      expect(s.count('x')).toBe(1)
    })

    it('returns the number of historical values for the variable', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('x', num('10'), 5)
      expect(s.count('x')).toBe(2)
    })
  })

  describe(Scope.prototype.clear, () => {
    it('removes all variables', () => {
      const s = new Scope()
      s.set('x', num('5'))
      s.clear()
      expect(s.has('x')).toBe(false)
      expect(s.size).toBe(0)
    })
  })

  describe(Scope.prototype.has, () => {
    describe('without before', () => {
      it('returns true if the variable is present', () => {
        const s = new Scope()
        s.set('x', num('5'))
        expect(s.has('x')).toBe(true)
        expect(s.has('y')).toBe(false)
      })

      it('returns false if the variable is absent', () => {
        const s = new Scope()
        s.set('y', num('5'))
        expect(s.has('x')).toBe(false)
        expect(s.has('y')).toBe(true)
      })

      it('does not destroy the history', () => {
        const s = new Scope()
        s.set('x', num('5'))
        s.set('x', num('10'))
        expect(s.has('x')).toBe(true)
        expect(s.count('x')).toBe(2)
      })
    })

    describe('with before', () => {
      it('returns true if the variable is historically present', () => {
        const s = new Scope()
        s.set('x', num('5'), 0)
        s.set('x', num('10'), 5)
        expect(s.has('x', 4)).toBe(true)
      })

      it('returns false if the variable is historically absent', () => {
        const s = new Scope()
        s.set('x', num('10'), 5)
        expect(s.has('x', 4)).toBe(false)
      })

      it('does not destroy the history', () => {
        const s = new Scope()
        s.set('x', num('5'), 0)
        s.set('x', num('10'), 5)
        expect(s.has('x', 4)).toBe(true)
        expect(s.count('x')).toBe(2)
      })
    })
  })

  describe(Scope.prototype.get, () => {
    describe('without before', () => {
      it('returns the latest value of the variable', () => {
        const s = new Scope()
        s.set('x', num('5'), 0)
        s.set('x', num('10'), 5)
        expect(s.get('x')).toMatchObject(num('10'))
      })

      it('returns undefined if the variable is not set', () => {
        const s = new Scope()
        expect(s.get('x')).toBeUndefined()
      })
    })

    describe('with before', () => {
      it('returns the latest value less than before', () => {
        const s = new Scope()
        s.set('x', num('5'), 0)
        s.set('x', num('10'), 5)
        expect(s.get('x', 4)).toMatchObject(num('5'))  
      })

      it('returns undefined if variable not present', () => {
        const s = new Scope()
        s.set('x', num('5'), 0)
        s.set('x', num('10'), 5)
        expect(s.get('x', -1)).toBeUndefined()
      })
    })
  })

  describe(Scope.prototype.set, () => {
    describe('without when', () => {
      it('returns the scope', () => {
        const s = new Scope()
        const t = s.set('x', num('5'))
        expect(t).toBeInstanceOf(Scope)
        expect(s).toEqual(t)
      })

      it('adds the variable when it was absent', () => {
        const s = new Scope()
        expect(s.has('x')).toBe(false)
        s.set('x', num('5'))
        expect(s.has('x')).toBe(true)
      })
    })

    describe('with when', () => {
      it('adds the variable to the history', () => {
        const s = new Scope()
        s.set('x', num('5'), 5)
        s.set('x', num('10'), 0)
        expect(s.get('x')).toMatchObject(num('5'))
        expect(s.get('x', 4)).toMatchObject(num('10'))
      })

      it('masks older values', () => {
        const s = new Scope()
        s.set('x', num('5'), 0)
        s.set('x', num('10'), 1)
        expect(s.get('x')).toMatchObject(num('10'))
        s.removeLast('x')
        expect(s.get('x')).toMatchObject(num('5'))
      })
    })
  })

  describe(Scope.prototype.removeLast, () => {
    it('removes the most recent value of a variable', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('x', num('10'), 5)
      expect(s.get('x')).toMatchObject(num('10'))
      s.removeLast('x')
      expect(s.get('x')).toMatchObject(num('5'))
    })

    it('removes the variable if no values are associated', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('x', num('10'), 5)
      s.removeLast('x')
      s.removeLast('x')
      expect(s.has('x')).toBe(false)
      expect(s.get('x')).toBeUndefined()
    })

    it('returns true if a value was removed', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('x', num('10'), 5)
      expect(s.removeLast('x')).toBe(true)
    })

    it('returns false if a variable was absent', () => {
      const s = new Scope()
      expect(s.removeLast('x')).toBe(false)
    })
  })

  describe(Scope.prototype.historical, () => {
    it('returns a new scope', () => {
      const s = new Scope()
      const h = s.historical()
      expect(h).not.toBe(s)
    })

    it('returns an empty scope if the current scope empty', () => {
      const s = new Scope()
      const h = s.historical()
      expect(h).not.toBe(s)
      expect(h.size).toBe(0)
    })

    it('returns variables in current if they exist before supplied epoch', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('y', num('10'), 5)
      s.set('z', num('15'), 10)
      const h = s.historical(7)
      expect(h.size).toBe(2)
      expect(h.has('x')).toBe(true)
      expect(h.has('y')).toBe(true)
      expect(h.has('z')).toBe(false)
    })

    it('returns older values for a variable if newer past epoch', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('x', num('10'), 5)
      const h = s.historical(4)
      expect(h.size).toBe(1)
      expect(h.get('x')).toMatchObject(num('5'))
    })

    it('does not affect the original scope', () => {
      const s = new Scope()
      s.set('x', num('5'), 0)
      s.set('x', num('10'), 5)
      const h = s.historical(4)
      h.removeLast('x')
      expect(h.size).toBe(0)
      expect(s.size).toBe(1)
      expect(s.count('x')).toBe(2)
      expect(s.get('x')).toMatchObject(num('10'))
    })
  })

  describe('identifiers', () => {
    it('is empty if no variables defined', () => {
      const s = new Scope()
      expect(s.identifiers.next().value).toBeUndefined()
    })

    it('contains an entry for each defined variable', () => {
      const s = new Scope()
      s.set('x', num('5'))
      s.set('y', num('10'))
      expect(s.identifiers).toContain(Symbol.for('x'))
      expect(s.identifiers).toContain(Symbol.for('y'))
    })
  })
})