import * as THREE from 'three'
import React, { useState, useRef } from 'react'
import styles from './Graph.module.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Base, real, invoke } from '../../common/Tree'
import { describe } from '../../common/description'

export interface GraphProps {

}

function *valuesBetween(expression: Base, min: number, max: number, slices: number = 100) {
  const increment = (max - min) / slices
  for(let i = min; i < max; i += increment) {
    const a = real(i)
    yield [a, invoke()(expression)(a)]
  }
}

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export const Graph = (props: GraphProps) => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
