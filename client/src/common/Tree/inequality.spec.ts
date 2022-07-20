import { real } from './real'
import { complex } from './complex'
import { variable } from './variable'
import { bool } from './boolean'
import { 
  lessThan, greaterThan, lessThanEquals, greaterThanEquals 
} from "./inequality";

describe('lessThan', () => {
  it('returns true for two ordered reals', () => {
    expect(lessThan(real(1), real(2))).toEqual(bool(true))
  })

  it('returns false for two unordered reals', () => {
    expect(lessThan(real(2), real(1))).toEqual(bool(false))
  })
})

describe('greaterThan', () => {

})

describe('lessThanEquals', () => {

})

describe('greaterThanEquals', () => {

})