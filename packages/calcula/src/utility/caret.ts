import { Particle } from "./operation"
import { Unicode } from "../Unicode"

export enum CaretPosition {
  none,
  before,
  between,
  after
}

export function embedCaret(position: CaretPosition, argument: Particle[]): Particle[];
export function embedCaret(position: CaretPosition, left: Particle[], operator: string, right: Particle[]): Particle[];
export function embedCaret(position: CaretPosition, left: Particle[], operator?: string, right?: Particle[]): Particle[]{
  const result = [...left]
  if(position === CaretPosition.before){ result.unshift(Unicode.process) }
  else if(!right && position === CaretPosition.after){ 
    result.push(Unicode.process) 
  }
  if(operator && right){ 
    result.push(operator)
    if(position === CaretPosition.between){ result.push(Unicode.process) }
    result.push(right)
    if(position === CaretPosition.after){ result.push(Unicode.process) }
  }
  return result
}
