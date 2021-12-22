import React, { useMemo, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Base, Real, real, invoke } from '../../common/Tree'
import { Color, Vector3 } from 'three';
import { Line } from '@react-three/drei';

interface CurveProps {
  expression: Base
  color: Color
}

function valuesBetween(expression: Base, min: number, max: number, slices: number = 100) {
  console.log('slices:', slices)
  const increment = (max - min) / slices
  const r = new Array<Vector3>(slices);
  const valueAt = invoke()(expression)
  let j = 0;
  for(let i = min; i < max; i += increment) {
    const y = valueAt(real(i))
    if(!(y instanceof Real)){ throw new Error(`Unexpected invocation result: ${y.$kind}`)}
    r[j++] = new Vector3(i, y.value, 0)
  }
  return r
}

type Range = {from: number, to: number, top: number, bottom: number, width: number, height: number, center: number}

const boundary = (camera: THREE.Camera, width: number, height: number): Range => ({
  center: camera.position.x,
  from: camera.position.x - width/2,
  to: camera.position.x + width/2,
  top: camera.position.y + height/2,
  bottom: camera.position.y - height/2,
  width,
  height
})

const inViewport = (point: Vector3|undefined, topEdge: number, bottomEdge: number) =>
  point !== undefined && point.y <= topEdge && point.y >= bottomEdge


// NOTE: Some of this could be cleaned up (c. TS/ES-2022) with Array.prototype.at
const segmentize = (points: Vector3[], topEdge: number, bottomEdge: number): Vector3[][] => {
  const r: Vector3[][] = [[]]
  let c = 0, previous: Vector3|undefined
  for(let p of points){
    if(Number.isNaN(p.y)) {
      if(r[c].length > 0){ 
        r.push([]) 
        c++
      }
    } else {
      const previousVisible = inViewport(previous, topEdge, bottomEdge)
      const currentVisible = inViewport(p, topEdge, bottomEdge)
      r[c].push(p)

      if(!currentVisible) {
        r.push([])
        c++
      } else if(!previousVisible && previous) { 
        r[c].unshift(previous) 
      }
      previous = p
    }
  }
  return r.filter(s => s.length > 1);
}

export const Curve = (props: CurveProps) => {

  const { camera, viewport } = useThree();
  const [range, setRange] = useState<Range>(boundary(camera, viewport.width, viewport.height))

  useFrame(({camera, viewport}, d) => {
    const vp = viewport.getCurrentViewport(camera)
    if(range.width !== vp.width || range.center !== camera.position.x){ 
      setRange(boundary(camera, vp.width, vp.height)) 
    }
  })

  const points = useMemo(
    () => valuesBetween(
      props.expression, 
      range.from, 
      range.to,
      Math.ceil(250 * Math.log10(range.width))
    ),
    [props.expression, range]
  )

  const segments = useMemo(
    () => segmentize(points, range.top, range.bottom),
    [points, range]
  )

  return <group>
    {segments.map((points, i) => <Line 
      points={points}
      color={props.color}
      lineWidth={1}
      key={i}
    />)}
  </group>
}
