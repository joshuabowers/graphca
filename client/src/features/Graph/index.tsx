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
import { Grid2 } from '../Geometry/Grid2';
import { Curve } from '../Geometry/Curve';

export interface GraphProps {

}

const getParsings = createArraySelector<RootState, string, Base>(
  (state) => state.graph.expressions,
  (input) => parser.value(input)
)

export const Graph = (props: GraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parsings = useAppSelector(getParsings)

  return (
    <Canvas orthographic camera={{position: [0, 0, 1], zoom: 30, up: [0, 0, 1]}} ref={canvasRef}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <gridHelper 
        args={[1000, 1000]}
        rotation={[Math.PI / 2, 0, 0]}
      /> */}
      <Grid2 />
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
      <MapControls enableRotate={false} />
    </Canvas>
  )
}
