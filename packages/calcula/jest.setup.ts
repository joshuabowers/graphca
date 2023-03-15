import { Operation, stringify } from './src/utility/operation'

type Serialized = [string, string] | Serialized[]

const arrange = (i: Operation): Serialized =>
  Array.isArray(i) ? i.map(arrange) : [stringify(i.particles), i.action]

const test = (i: unknown): boolean =>
  (typeof i === 'object' && i && 'particles' in i && 'action' in i)
  || Array.isArray(i) && i.every(test)

expect.addSnapshotSerializer({
  // test: (v: unknown) => Array.isArray(v) && v.every(
  //   i => typeof i === 'object' && "particles" in i && "action" in i
  // ),
  test,
  print: (val, print) => {
    const v = val as Operation[]
    return print(v.map(arrange))
  }
})
