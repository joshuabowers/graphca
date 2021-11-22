import { Kind, Variable } from './Expression'
// import { Variable } from './Variable'

export function variable(name: string) {
  return new Variable(name)
}
