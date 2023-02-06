import { method, multi, Multi, _ } from '@arrows/multimethod'
import { isWriter, Writer } from '../monads/writer'
import { Operation, stringify } from './operation'
import { TreeNode, Notation, Species } from './tree'
import { Real, Complex, isReal, isComplex } from '../primitives'
import { Unicode } from '../Unicode'

export type ExpectCloseTo = Multi 
  & ((actual: Writer<Real, Operation>, expected: Writer<Real, Operation>, precision: number) => void)
  & ((actual: Writer<Complex, Operation>, expected: Writer<Complex, Operation>, precision: number) => void)

export const expectCloseTo: ExpectCloseTo = multi(
  method(
    [isReal, isReal, _], 
    (actual: Writer<Real, Operation>, expected: Writer<Real, Operation>, precision: number) => 
      expect(actual.value.value).toBeCloseTo(expected.value.value, precision)
  ),
  method(
    [isComplex, isComplex, _],
    (actual: Writer<Complex, Operation>, expected: Writer<Complex, Operation>, precision: number) => {
      expect(actual.value.a).toBeCloseTo(expected.value.a, precision)
      expect(actual.value.b).toBeCloseTo(expected.value.b, precision)
    }
  )
)

export type Op = [string, string]

export const expectWriterTreeNode = <
  Actual extends TreeNode,
  Expected extends TreeNode|Writer<TreeNode, Operation>
>(
  actual: Writer<Actual, Operation>, expected: Expected
) => (...operations: Op[]) => {
  expect(actual.value).toEqual(isWriter(expected) ? expected.value : expected)
  expect(actual.log.length).toEqual(operations.length)
  const stringified = actual.log.map(({particles, action}) => [stringify(particles), action])
  expect(stringified).toEqual(operations)
}

export const realOps = (value: string): Op[] => [[value, 'created real']]
export const complexOps = (a: string, b: string): Op[] => 
  [[`${a}+${b}${Unicode.i}`, 'created complex']]

export const variableOps = (name: string): Op[] => [[name, 'referenced variable']]

export const expression = (name: string, notation: Notation, left: string, right: string) => {
  switch(notation){
    case Notation.infix:
      return `(${left}${name}${right})`
    case Notation.postfix:
      return 'error';
    case Notation.prefix:
      return `${name}(${left},${right})`
  }
}

export const binaryOps = (
  name: string, notation: Notation, species: Species
) =>
  (action: string, left: Op[], right: Op[], result: Op[]): Op[] => [
  [expression(name, notation, left[0][0], right[0][0]), `identified ${species.toLocaleLowerCase()}`],
  [expression(name, notation, '|'+left[0][0], right[0][0]), 'processing left operand'],
  ...left,
  [expression(name, notation, left[left.length-1][0], '|'+right[0][0]), 'processed left operand; processing right operand'],
  ...right,
  [expression(name, notation, left[left.length-1][0], right[right.length-1][0]+'|'), 'processed right operand'],
  [expression(name, notation, left[left.length-1][0], right[right.length-1][0]), action],
  ...result
]

export const addOps = binaryOps('+', Notation.infix, Species.add)
export const multiplyOps = binaryOps('*', Notation.infix, Species.multiply)
export const raiseOps = binaryOps('^', Notation.infix, Species.raise)
export const logOps = binaryOps('log', Notation.prefix, Species.log)
