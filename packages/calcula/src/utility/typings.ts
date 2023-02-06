import { Writer } from '../monads/writer'
import { Operation } from './operation'

export type CreateFn<T, U> = (value: T) => U
export type CastFn<T, U> = (value: T) => Writer<U, Operation>
