import { Unicode } from './MathSymbols';
import {
  Tree,
  add, subtract, multiply, divide, negate, raise,
  real, complex
} from './Tree'
import { treeParser } from "./treeParser";

const expectObject = (input: string, expected: Tree) => {
  let output = undefined
  expect(() => {output = treeParser.value(input)}).not.toThrow()
  expect(output).not.toBeUndefined()
  expect(output).toMatchObject(expected)
}

describe('treeParser', () => {
  describe('of constants', () => {
    it('matches reals', () => {
      expectObject('1.2345', real(1.2345))
    })

    it('matches complex numbers', () => {
      expectObject(`1.23 + 4.56${Unicode.i}`, complex(1.23, 4.56))
    })
  })

  describe('of additions', () => {
    it('matches a simple binary', () => {
      expectObject('1.23 + 4.56', add(real(1.23), real(4.56)))
    })

    it('matches nested additions left associatively', () => {
      expectObject('1.23 + 4.56 + 7.89', add(
        add(real(1.23), real(4.56)),
        real(7.89)
      ))
    })
  })

  describe('of subtractions', () => {
    it('matches a simple binary', () => {
      expectObject('1 - 2', subtract(real(1), real(2)))
    })

    it('matches nested subtractions left associatively', () => {
      expectObject('1 - 2 - 3', subtract(
        subtract(real(1), real(2)),
        real(3)
      ))
    })

    it('matches mixed addition and subtraction', () => {
      expectObject('1 + 2 - 3', subtract(
        add(real(1), real(2)),
        real(3)
      ))
    })

    it('matches an alternative symbol for subtraction', () => {
      expectObject(`1 ${Unicode.minus} 2`, subtract(real(1), real(2)))
    })
  })

  describe('of multiplications', () => {
    it('matches a simple binary', () => {
      expectObject('1 * 2', multiply(real(1), real(2)))
    })

    it('matches nested multiplications left associatively', () => {
      expectObject('1 * 2 * 3', multiply(
        multiply(real(1), real(2)),
        real(3)
      ))
    })

    it('has a higher precedence for multiplication over addition', () => {
      expectObject('2 * 3 + 4 * 5', add(
        multiply(real(2), real(3)),
        multiply(real(4), real(5))
      ))
    })

    it('matches an alternative symbol for multiplication', () => {
      expectObject(`2 ${Unicode.multiplication} 3`, multiply(real(2), real(3)))
    })
  })

  describe('of divisions', () => {
    it('matches a simple binary', () => {
      expectObject('1 / 2', divide(real(1), real(2)))
    })

    it('matches nested divisions left associatively', () => {
      expectObject('1 / 2 / 3', divide(
        divide(real(1), real(2)),
        real(3)
      ))
    })

    it('has a higher precedence for division over addition', () => {
      expectObject('1 / 2 + 3 / 4', add(
        divide(real(1), real(2)),
        divide(real(3), real(4))
      ))
    })

    it('has equal precedence to multiplication', () => {
      expectObject('1 / 2 * 3', multiply(
        divide(real(1), real(2)),
        real(3)
      ))
      expectObject('1 * 2 / 3', divide(
        multiply(real(1), real(2)),
        real(3)
      ))
    })

    it('matches an alternative symbol for division', () => {
      expectObject(`1 ${Unicode.division} 2`, divide(real(1), real(2)))
    })
  })
})
