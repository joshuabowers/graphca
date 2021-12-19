import * as THREE from 'three'
import React, { useRef, useMemo, useState } from 'react'
// import styles from './Graph.module.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Base, Real, real, invoke } from '../../common/Tree'
import { RootState } from '../../app/store';
import { createArraySelector } from 'reselect-map';
import { parser } from '../../common/parser';
import { useAppSelector } from '../../app/hooks';
import { Color, Vector3 } from 'three';
import { Line, MapControls } from '@react-three/drei';

export interface GraphProps {

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

const getParsings = createArraySelector<RootState, string, Base>(
  (state) => state.graph.expressions,
  (input) => parser.value(input)
)

interface CurveProps {
  expression: Base
  color: Color
}

type Range = {from: number, to: number, width: number, center: number}

const boundary = (camera: THREE.Camera, width: number): Range => ({
  center: camera.position.x,
  from: camera.position.x - width/2,
  to: camera.position.x + width/2,
  width
})

const Curve = (props: CurveProps) => {
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
  return range.width > 0 && points.length > 0 ? <Line 
    points={points}
    color={props.color}
    lineWidth={1}
  /> : <></>
}

export const Graph = (props: GraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parsings = useAppSelector(getParsings)

  return (
    <Canvas orthographic camera={{position: [0, 0, 1], zoom: 30, up: [0, 0, 1]}} ref={canvasRef}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <gridHelper 
        args={[1000, 1000]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <group>
      {
        parsings.map((v,i) => 
          <Curve 
            expression={v} 
            color={new THREE.Color('green')} 
            key={i} 
          />
        )
      }
      </group>
      <MapControls />
    </Canvas>
  )
}
