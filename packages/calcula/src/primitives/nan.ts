import { Writer, unit } from '../monads/writer'
import { Species, Clades, isSpecies } from '../utility/tree'
// import { $kind } from '../utility/ASTNode'
import { NaN } from "../closures/primitive"
export { NaN }

export const nan: Writer<NaN> = unit({
  clade: Clades.primitive,
  species: Species.nan,
  value: NaN
})

export const isNaN = isSpecies<NaN>(Species.nan)
