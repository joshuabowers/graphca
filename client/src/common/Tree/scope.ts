// import { Base } from './Expression'
import { Variable } from "./variable"

export type Scope = Map<string, Variable>

export const scope = (entries?: [[string, Variable]]): Scope => 
  new Map<string, Variable>(entries)
