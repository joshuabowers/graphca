import React, { useState } from 'react'
import THREE, { Color, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Segment, Segments, Html } from '@react-three/drei'

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
  const xSubdivisions = Math.ceil(Math.abs(xEnd - xStart) / step),
    ySubdivisions = Math.ceil(Math.abs(yEnd - yStart) / step)

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

  console.info(boundary)
  console.info({magnitude, scale, lowerScale})
  console.info({leftEdge, bottomEdge})
  console.info({step, xStart, yStart, xEnd, yEnd})
  console.info({xSubdivisions, ySubdivisions})

  const segments: GridLine[] = []
  const black = new Color(0,0,0), gray = new Color(0.45, 0.45, 0.45)

  const labelAttachX = originClamp(leftEdge+0.5*step, leftEdge + boundary.width - 1.5*step),
    labelAttachY = originClamp(bottomEdge+step, bottomEdge + boundary.height - 0.5*step)

  for(let x = xStart; x <= xEnd; x += step){
    segments.push({
      start: new Vector3(x, yStart, 0),
      end: new Vector3(x, yEnd, 0),
      color: nearly(x, 0) ? black : gray,
      key: `x:${x}`
    })
  }
  for(let y = yStart; y <= yEnd; y += step){
    segments.push({
      start: new Vector3(xStart, y, 0),
      end: new Vector3(xEnd, y, 0),
      color: nearly(y, 0) ? black : gray,
      key: `y:${y}`
    })
  }

  const labelStep = 10**(Math.floor(magnitude)-1) * 5
  const labels: Label[] = []

  for(let x = Math.ceil(xStart / labelStep) * labelStep; x <= xEnd; x += labelStep){
    labels.push(label(x, labelAttachY, x, 'x'))
  }
  for(let y = Math.ceil(yStart / labelStep) * labelStep; y <= yEnd; y += labelStep){
    labels.push(label(labelAttachX, y, y, 'y'))
  }

  console.info({labelAttachX, labelAttachY, labelStep})

  console.log(segments)

  if(lowerScale < 0.25){
    console.log('RENDER THE LOWER SCALE!')
  }

  return <group>
    <Segments limit={segments.length+1} lineWidth={1.0}>
      {
        segments.map(({start, end, color, key}, i) => (
          <Segment start={start} end={end} color={color} key={key} />
        ))
      }
    </Segments>
    <group>
      {
        labels.map(({position, content, key}) => (
          <Html position={position} key={key}>{content}</Html>
        ))
      }
    </group>
  </group>
}
