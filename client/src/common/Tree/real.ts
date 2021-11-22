import { Real } from "./Expression";
// import { Real } from './Constant/Real'

export function real(value: number) {
  return new Real(value)
}
