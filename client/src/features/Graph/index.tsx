import * as THREE from 'three'
import React, { useState, useRef, useMemo } from 'react'
import styles from './Graph.module.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Base, Real, real, invoke } from '../../common/Tree'
import { RootState } from '../../app/store';
import { describe } from '../../common/description'
import { createSelector } from 'reselect';
import { createArraySelector } from 'reselect-map';
import { parser } from '../../common/parser';
import { useAppSelector } from '../../app/hooks';
import { Color, Vector3 } from 'three';
import { Line } from '@react-three/drei';

export interface GraphProps {

}

function valuesBetween(expression: Base, min: number, max: number, slices: number = 100) {
  const increment = (max - min) / slices
  const r = new Array<Vector3>(slices);
  let j = 0;
  for(let i = min; i < max; i += increment) {
    const y = invoke()(expression)(real(i))
    if(!(y instanceof Real)){ throw new Error(`Unexpected invocation result: ${y.$kind}`)}
    r[j++] = new Vector3(i, y.value, 0)
  }
  return r
}

const getGraph = (state: RootState) => state.graph
const getExpressions = createSelector(getGraph, (graph) => graph.expressions)
const getParsings = createArraySelector<RootState, string, Base>(
  (state) => state.graph.expressions,
  (input) => parser.value(input)
)

interface CurveProps {
  expression: Base
  color: Color
}

const Curve = (props: CurveProps) => {
  console.info('generating curve for', props.expression)
  const points = useMemo(
    () => valuesBetween(props.expression, -100, 100, 1000),
    [props.expression]
  )
  console.info('points:', points)
  return <Line 
    points={points}
    color={props.color}
  />
}

export const Graph = (props: GraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parsings = useAppSelector(getParsings)

  const color = useMemo(
    () => new THREE.Color(
      canvasRef.current 
        ? window.getComputedStyle(canvasRef.current).getPropertyValue('--curve-color') 
        : 'green'
    ),
    [styles, canvasRef]
  )

  return (
    <Canvas ref={canvasRef}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <gridHelper 
        args={[1000, 1000]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <group>
      {
        parsings.map((v,i) => 
          <Curve expression={v} color={color} key={i} />
        )
      }
      </group>
    </Canvas>
  )
}
