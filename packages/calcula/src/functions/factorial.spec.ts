import { unit } from '../monads/writer';
import { 
  expectCloseTo, expectWriterTreeNode,
  realOps, complexOps, variableOps, addOps, multiplyOps,
  factorialOps
} from '../utility/expectations'
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
      ...factorialOps(
        'degenerate case',
        realOps('0'),
        realOps('1')
      )
    )
  })

  it('returns the factorial for positive integers', () => {
    expectWriterTreeNode(
      factorial(real(2)),
      real(2)
    )(
      ...factorialOps(
        'real factorial',
        realOps('2'),
        multiplyOps(
          'real multiplication',
          realOps('2'),
          factorialOps(
            'real factorial',
            addOps(
              'real addition',
              realOps('2'),
              realOps('-1'),
              realOps('1')
            ),
            multiplyOps(
              'multiplicative identity',
              realOps('1'),
              factorialOps(
                'degenerate case',
                addOps(
                  'real addition',
                  realOps('1'),
                  realOps('-1'),
                  realOps('0')
                ),
                realOps('1')
              ),
              realOps('1')
            )
          ),
          realOps('2')
        )
      )
    )
  })

  it('returns complex 1 for an input of complex 0', () => {
    expectWriterTreeNode(
      factorial(complex([0, 0])),
      complex([1, 0])
    )(
      ...factorialOps(
        'degenerate case',
        complexOps('0', '0'),
        complexOps('1', '0')
      )
    )
  })

  it('returns the factorial for a integer complex', () => {
    expectWriterTreeNode(
      factorial(complex([2, 0])),
      complex([2, 0])
    )(
      ...factorialOps(
        'complex factorial',
        complexOps('2', '0'),
        multiplyOps(
          'complex multiplication',
          complexOps('2', '0'),
          factorialOps(
            'complex factorial',
            addOps(
              'complex addition',
              complexOps('2', '0'),
              complexOps('-1', '0'),
              complexOps('1', '0')
            ),
            multiplyOps(
              'complex multiplication',
              complexOps('1', '0'),
              factorialOps(
                'degenerate case',
                addOps(
                  'complex addition',
                  complexOps('1', '0'),
                  complexOps('-1', '0'),
                  complexOps('0', '0')
                ),
                complexOps('1', '0')
              ),
              complexOps('1', '0')
            )
          ),
          complexOps('2', '0')
        )
      )
    )
  })

  it('returns complex infinity for non-positive integer reals', () => {
    expectWriterTreeNode(
      factorial(real(-5)),
      ComplexInfinity
    )(
      ...factorialOps(
        'singularity',
        realOps('-5'),
        [[Unicode.complexInfinity, 'created complex']]
      )
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
      $factorial(variable('x'))[0]
    )(
      ...factorialOps(
        'created factorial',
        variableOps('x'),
        []
      )
    )
  })
})
