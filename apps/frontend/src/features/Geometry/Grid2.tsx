import React, { useState } from 'react'
import THREE, { Color, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import styles from './Grid2.module.css'

export interface Grid2Props {

}

type Boundary = {
  center: Vector3,
  width: number,
  height: number
}

const createBoundary = (center: Vector3, width: number, height: number): Boundary => ({
  center: center, width, height
})

const epsilon = 1e-10

const nearly = (a: number, b: number) =>
  Math.abs(a-b) < epsilon

type GridLine = {
  start: Vector3,
  end: Vector3,
  color: Color,
  transparent: boolean,
  opacity: number,
  key: string
}

type Label = {
  position: Vector3,
  content: string,
  key: string
}

const label = (x: number, y: number, value: number, axis: string): Label => ({
  position: new Vector3(x, y, 0),
  content: String(value),
  key: `${axis}:${value}`
})

const originClamp = (lower: number, upper: number): number => (
  Math.min(upper, Math.max(0, lower))
)

interface GridColor {
  origin: THREE.Color
  normal: THREE.Color
}

const black = new Color(0,0,0), gray = new Color(0.45, 0.45, 0.45),
  white = new Color(0xFFFFFF), darkgray = new Color(0x222222)

const gridColors = (isDark: boolean): GridColor =>
  isDark 
    ? {origin: white, normal: darkgray} 
    : {origin: black, normal: gray}

const axisOrient = (axis: 'x' | 'y', i: number, cap: number) =>
  axis === 'x' ? new Vector3(i, cap, 0) : new Vector3(cap, i, 0)

const addSegments = (segments: Map<string, GridLine>, start: number, end: number, 
  pStart: number, pEnd: number, step: number, axis: 'x' | 'y', 
  colors: GridColor, transparent: boolean = false, opacity: number = 1.0) => {
  for(let i = start; i <= end; i += step){
    const key = `${axis}:${i}`
    if(!segments.has(key)){
      segments.set(key, {
        start: axisOrient(axis, i, pStart),
        end: axisOrient(axis, i, pEnd),
        color: nearly(i, 0) ? colors.origin : colors.normal,
        transparent, opacity,
        key: `${axis}:${i}`
      })
    }
  }
}

export const Grid2 = (props: Grid2Props) => {
  const { camera, viewport } = useThree()
  const [boundary, setBoundary] = useState<Boundary>(
    createBoundary(camera.position.clone(), viewport.width, viewport.height)
  )
  const magnitude = Math.log10(boundary.width)
  const scale = Math.round(magnitude)
  const lowerScale = magnitude - scale
  const leftEdge = camera.position.x - boundary.width/2
  const bottomEdge = camera.position.y - boundary.height/2
  const step = 10**(scale-1), 
    xStart = Math.trunc((leftEdge - step) / step) * step,
    yStart = Math.trunc((bottomEdge - step) / step) * step,
    xEnd = Math.trunc((leftEdge + boundary.width + step) / step) * step,
    yEnd = Math.trunc((bottomEdge + boundary.height + step) / step) * step

  // This might need throttling/debouncing to cull out a lot
  // of unnecessary calculations. E.g., see:
  // https://github.com/pmndrs/react-three-fiber/discussions/380
  useFrame(({camera, viewport}, delta) => {
    const v = viewport.getCurrentViewport(camera)
    const {x: cx} = camera.position
    const {x: bx} = boundary.center
    if( 
      !nearly(v.width, boundary.width) 
      || !nearly(v.height, boundary.height)
      || !nearly(cx, bx)
    ){
      setBoundary(createBoundary(camera.position.clone(), v.width, v.height))
    }
  })

  const segments = new Map<string, GridLine>()

  const labelAttachX = originClamp(leftEdge+0.5*step, leftEdge + boundary.width - 1.5*step),
    labelAttachY = originClamp(bottomEdge+step, bottomEdge + boundary.height - 0.5*step)

  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const colors = gridColors(isDark)

  addSegments(segments, xStart, xEnd, yStart, yEnd, step, 'x', colors)
  addSegments(segments, yStart, yEnd, xStart, xEnd, step, 'y', colors)

  // Will range from about -0.5 to 0; might want to constrain to >-0.75 to
  // lessen performance impact. If so, opacity calc changes to:
  // opacity = (lowerScale / -0.25)
  // or whatever the distance is for the lowerScale thresholds.
  if(lowerScale < 0){
    const lowerStep = 10**(scale-2), opacity = (lowerScale / -0.5)
    addSegments(segments, xStart, xEnd, yStart, yEnd, lowerStep, 'x', colors, true, opacity)
    addSegments(segments, yStart, yEnd, xStart, xEnd, lowerStep, 'y', colors, true, opacity)
  }

  const labelStep = 10**(Math.floor(magnitude)-1) * 5
  const labels: Label[] = []

  for(let x = Math.ceil(xStart / labelStep) * labelStep; x <= xEnd; x += labelStep){
    labels.push(label(x, labelAttachY, x, 'x'))
  }
  for(let y = Math.ceil(yStart / labelStep) * labelStep; y <= yEnd; y += labelStep){
    labels.push(label(labelAttachX, y, y, 'y'))
  }

  return <group>
    <group>
      {
        Array.from(segments.values(), ({start, end, color, transparent, opacity, key}) => (
          <Line 
            key={key} 
            points={[start, end]}
            color={color}
            transparent={transparent}
            opacity={opacity}
            lineWidth={1}
          />
        ))
      }
    </group>
    <group>
      {
        labels.map(({position, content, key}) => (
          <Html position={position} className={styles.axisLabel} key={key}>{content}</Html>
        ))
      }
    </group>
  </group>
}
