import { Operation, stringify } from './src/utility/operation'

expect.addSnapshotSerializer({
  test: (v: unknown) => Array.isArray(v) && v.every(
    i => typeof i === 'object' && "particles" in i && "action" in i
  ),
  print: (val, print) => {
    const v = val as Operation[]
    return print(v.map(i => [stringify(i.particles), i.action]))
  }
})
