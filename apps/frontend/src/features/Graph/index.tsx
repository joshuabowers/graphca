import * as THREE from 'three'
import React, { useRef } from 'react'
import styles from './Graph.module.css';
import { Canvas } from '@react-three/fiber';
// import { Base } from '../../common/Tree'
import { TreeNode, W, parser } from '@bowers/calcula'
import { RootState } from '../../app/store';
import { Plot } from './Graph.slice';
import { createArraySelector } from 'reselect-map';
// import { parser } from '../../common/parser';
import { useAppSelector } from '../../app/hooks';
import { MapControls } from '@react-three/drei';
import { Grid2 } from '../Geometry/Grid2';
import { Curve } from '../Geometry/Curve';

export interface GraphProps {

}

interface Parsing {
  expression: W.Writer<TreeNode>,
  color: THREE.Color
}

const getParsings = createArraySelector<RootState, Plot, Parsing>(
  (state) => state.graph.plots,
  (plot) => ({
    expression: parser.value(plot.expression), 
    color: new THREE.Color(plot.color ?? 'green')
  })
)

export const Graph = (props: GraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parsings = useAppSelector(getParsings)

  return (
    <Canvas 
      orthographic 
      camera={{position: [0, 0, 1], zoom: 30, up: [0, 0, 1]}} 
      ref={canvasRef}
      className={styles.default}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Grid2 />
      <group>
      {
        parsings.map((v,i) => 
          <Curve 
            expression={v.expression} 
            color={v.color} 
            key={i} 
          />
        )
      }
      </group>
      <MapControls enableRotate={false} />
    </Canvas>
  )
}
