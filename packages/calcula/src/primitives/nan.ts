import { Writer, writer } from '../monads/writer'
import { Operation, operation } from '../utility/operation'
import { Species, Clades, isSpecies } from '../utility/tree'
import { NaN } from "../closures/primitive"
export { NaN }

export const nan: Writer<NaN, Operation> = writer(
  {clade: Clades.primitive, species: Species.nan, raw: NaN},
  operation(['NaN'], 'not a number')
)

export const isNaN = isSpecies<NaN>(Species.nan)
