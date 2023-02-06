import { Writer, writer } from '../monads/writer'
import { Operation, operation } from '../utility/operation'
import { Species, Clades, isSpecies } from '../utility/tree'
import { Nil } from "../closures/primitive"
export { Nil }

export const nil: Writer<Nil, Operation> = writer(
  {clade: Clades.primitive, species: Species.nil},
  operation(['nil'], 'nothing')
)

export const isNil = isSpecies<Nil>(Species.nil)
