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

type Range = {from: number, to: number, width: number, center: number}

const boundary = (camera: THREE.Camera, width: number): Range => ({
  center: camera.position.x,
  from: camera.position.x - width/2,
  to: camera.position.x + width/2,
  width
})

const segmentize = (points: Vector3[], magnitude: number): Vector3[][] => {
  const r: Vector3[][] = [[]]
  const scale = 10**Math.floor(magnitude), extrema = 10**Math.ceil(magnitude)
  console.log(magnitude, scale, extrema)
  let c = 0, d = -1
  for(let p of points){
    if(Number.isNaN(p.y)) {
      if(r[c].length > 0){ 
        r.push([]) 
        c++
        d = -1
      }
    } else {
      // TODO: Needs work
      if(d >= 0 && r[c][d] && Math.abs(r[c][d].y - p.y) > scale){
        const lerpX = (r[c][d].x + p.x)/2
        r[c].push(new Vector3(lerpX, Math.sign(r[c][d].y)*extrema, 0))
        r.push([new Vector3(lerpX, Math.sign(p.y)*extrema, 0)])
        c++
        d = 1
      } else {
        d++
      }
      r[c].push(p)
    }
  }
  return r.filter(s => s.length > 1);
}

export const Curve = (props: CurveProps) => {

  const { camera, viewport } = useThree();
  const [range, setRange] = useState<Range>(boundary(camera, viewport.width))

  useFrame(({camera, viewport}, d) => {
    const vp = viewport.getCurrentViewport(camera)
    if(range.width !== vp.width || range.center !== camera.position.x){ 
      setRange(boundary(camera, vp.width)) 
    }
  })

  const points = useMemo(
    () => valuesBetween(
      props.expression, 
      range.from, 
      range.to,
      250
    ),
    [props.expression, range]
  )

  const segments = useMemo(
    () => segmentize(points, Math.log10(viewport.getCurrentViewport(camera).height)),
    [points]
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
