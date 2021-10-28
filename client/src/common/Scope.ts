import { Heap } from 'heap-js'
import { Node } from 'pegase'

export type Identifier = string | symbol
export interface Event {
  when: number
  node: Node
}

export function toSymbol(identifier: Identifier): symbol {
  return typeof identifier === 'symbol' ? identifier : Symbol.for(identifier)
}

function eventComparator(a: Event, b: Event): number {
  return b.when - a.when
}

function filter(heap: Heap<Event>, before: number): Heap<Event> {
  const clone = heap.clone()
  while(clone.size() > 0 && clone.peek().when > before){ clone.pop() }
  return clone
}

export class Scope {
  protected variables: Map<symbol, Heap<Event>>

  constructor() {
    this.variables = new Map<symbol, Heap<Event>>()
  }

  has(identifier: Identifier, before = Date.now()) {
    const id = toSymbol(identifier)
    const heap = this.variables.get(id)
    if(!heap){ return false }
    const clone = filter(heap, before)
    return clone.peek() !== undefined
  }

  get(identifier: Identifier, before = Date.now()) {
    const id = toSymbol(identifier)
    const heap = this.variables.get(id)
    if(!heap){ return undefined }
    const clone = filter(heap, before)
    return clone.peek()?.node
  }

  set(identifier: Identifier, node: Node, when = Date.now()) {
    const id = toSymbol(identifier)
    const heap = this.variables.get(id) ?? new Heap<Event>(eventComparator)
    heap.push({when, node})
    this.variables.set(id, heap)
    return this;
  }

  clear() {
    this.variables.clear()
  }

  removeLast(identifier: Identifier) {
    const id = toSymbol(identifier)
    const heap = this.variables.get(id)
    if(!heap){ return false }
    const last = heap.pop()
    if(heap.size() === 0){ this.variables.delete(id) }
    return last !== undefined
  }

  get identifiers() {
    return this.variables.keys()
  }

  get size() {
    return this.variables.size
  }

  count(identifier: Identifier) {
    const id = toSymbol(identifier)
    return this.variables.get(id)?.size() ?? 0
  }

  historical(before = Date.now()) {
    const clone = new Scope()
    this.variables.forEach((heap, id) => {
      const copy = filter(heap, before)
      if(copy.size() > 0){ clone.variables.set(id, copy)}
    })
    return clone
  }
}