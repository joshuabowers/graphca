import React from 'react'
import { treeParser } from "./treeParser";
import { Scope, scope } from "./visitors/Visitor";
import { Evaluation } from "./visitors/Evaluation";
import { Simplification } from "./visitors/Simplification";
import { Componentization } from "./visitors/Componentization";
export { scope }
export type { Scope }

type Styles = {
  readonly [key: string]: string
}

export function parse(input: string, scope: Scope, styles: Styles): JSX.Element {
  console.log('parsing expression:', input)
  try {
    const parsed = treeParser.value(input)
    const output = 
      parsed
        .accept(new Evaluation(scope))
        .accept(new Simplification(scope))
        .accept(new Componentization(scope))
    return <div className={styles.result}>{'=>'} {output}</div>
  } catch(error: any) {
    return <div className={styles.error}>{error.message}</div>
  }
}
