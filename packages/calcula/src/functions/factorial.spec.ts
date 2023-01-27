import { unit } from '../monads/writer';
import { expectCloseTo, expectWriterTreeNode } from '../utility/expectations'
import { Clades, Species } from '../utility/tree';
import { ComplexInfinity } from '../primitives/complex';
import { real, complex } from '../primitives';
import { variable } from '../variable';
import { factorial, $factorial } from "./factorial";
import { gamma } from './gamma'
import { Unicode } from '../Unicode'

describe('$factorial', () => {
  it('generates a Factorial for a TreeNode input', () => {
    expect(
      $factorial(unit(variable('x').value))[0]
    ).toEqual({
      clade: Clades.unary, genus: undefined, species: Species.factorial,
      expression: unit(variable('x').value)
    })
  })
})

describe('factorial', () => {
  it('returns 1 for an input of 0', () => {
    expectWriterTreeNode(
      factorial(real(0)),
      real(1)
    )(
      ['0', '0', 'given primitive'],
      ['(0)!', '1', 'degenerate case'],
      ['1', '1', 'given primitive']
    )
  })

  it('returns the factorial for positive integers', () => {
    expectWriterTreeNode(
      factorial(real(2)),
      real(2)
    )(
      ['2', '2', 'given primitive'],
      ['(2)!', '2 * (2 - 1)!', 'real factorial'],
      ['-1', '-1', 'given primitive'],
      ['2 + -1', '1', 'real addition'],
      ['1', '1', 'given primitive'],
      ['(1)!', '1 * (1 - 1)!', 'real factorial'],
      ['-1', '-1', 'given primitive'],
      ['1 + -1', '0', 'real addition'],
      ['0', '0', 'given primitive'],
      ['(0)!', '1', 'degenerate case'],
      ['1', '1', 'given primitive'],
      ['1 * 1', '1', 'multiplicative identity'],
      ['2 * 1', '2', 'real multiplication'],
      ['2', '2', 'given primitive']
    )
  })

  it('returns complex 1 for an input of complex 0', () => {
    expectWriterTreeNode(
      factorial(complex([0, 0])),
      complex([1, 0])
    )(
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive'],
      [`(0+0${Unicode.i})!`, `1+0${Unicode.i}`, 'degenerate case'],
      [`1+0${Unicode.i}`, `1+0${Unicode.i}`, 'given primitive']
    )
  })

  it('returns the factorial for a integer complex', () => {
    expectWriterTreeNode(
      factorial(complex([2, 0])),
      complex([2, 0])
    )(
      [`2+0${Unicode.i}`, `2+0${Unicode.i}`, 'given primitive'],
      [
        `(2+0${Unicode.i})!`, 
        `2+0${Unicode.i} * (2+0${Unicode.i} - 1)!`, 
        'complex factorial'
      ],
      [`-1+0${Unicode.i}`, `-1+0${Unicode.i}`, 'given primitive'],
      [
        `2+0${Unicode.i} + -1+0${Unicode.i}`, 
        `1+0${Unicode.i}`, 
        'complex addition'
      ],
      [`1+0${Unicode.i}`, `1+0${Unicode.i}`, 'given primitive'],
      [
        `(1+0${Unicode.i})!`, 
        `1+0${Unicode.i} * (1+0${Unicode.i} - 1)!`,
        'complex factorial'
      ],
      [`-1+0${Unicode.i}`, `-1+0${Unicode.i}`, 'given primitive'],
      [
        `1+0${Unicode.i} + -1+0${Unicode.i}`, 
        `0+0${Unicode.i}`, 
        'complex addition'
      ],
      [`0+0${Unicode.i}`, `0+0${Unicode.i}`, 'given primitive'],
      [`(0+0${Unicode.i})!`, `1+0${Unicode.i}`, 'degenerate case'],
      [`1+0${Unicode.i}`, `1+0${Unicode.i}`, 'given primitive'],
      [
        `1+0${Unicode.i} * 1+0${Unicode.i}`, 
        `1+0${Unicode.i}`, 
        'complex multiplication'
      ],
      [`1+0${Unicode.i}`, `1+0${Unicode.i}`, 'given primitive'],
      [
        `2+0${Unicode.i} * 1+0${Unicode.i}`, 
        `2+0${Unicode.i}`, 
        'complex multiplication'
      ],
      [`2+0${Unicode.i}`, `2+0${Unicode.i}`, 'given primitive']
    )
  })

  it('returns complex infinity for non-positive integer reals', () => {
    expectWriterTreeNode(
      factorial(real(-5)),
      ComplexInfinity
    )(
      ['-5', '-5', 'given primitive'],
      ['(-5)!', `${Unicode.complexInfinity}`, 'singularity'],
      [`${Unicode.complexInfinity}`, `${Unicode.complexInfinity}`, 'given primitive']
    )
  })

  it('returns a shifted gamma for non-integer reals', () => {
    expectCloseTo(factorial(real(5.5)), gamma(real(6.5)), 10)
  })

  it('returns a shifted gamma for non-integer complex numbers', () => {
    expectCloseTo(factorial(complex([1, 1])), gamma(complex([2, 1])), 10)
  })

  it('returns a Factorial node for unbound variables', () => {
    expectWriterTreeNode(
      factorial(variable('x')),
      $factorial(unit(variable('x').value))[0]
    )(
      ['x', 'x', 'given variable'],
      ['(x)!', '(x)!', 'factorial']
    )
  })
})
