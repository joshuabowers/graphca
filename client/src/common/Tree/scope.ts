import { Variable } from "./variable"

export type Scope = Map<string, Variable>

type Entries = Iterable<readonly [string, Variable]>

export const scope = (entries: Entries = []): Scope => 
  new Map<string, Variable>(entries)
