import { Writer, unit } from '../monads/writer'
import { Species, Clades, isSpecies } from '../utility/tree'
import { Nil } from "../closures/primitive"
export { Nil }

export const nil: Writer<Nil> = unit({
  clade: Clades.primitive,
  species: Species.nil
})

export const isNil = isSpecies<Nil>(Species.nil)
