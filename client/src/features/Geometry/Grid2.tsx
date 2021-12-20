import React, { useState } from 'react'
import THREE, { Color, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Segment, Segments } from '@react-three/drei'

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

export const Grid2 = (props: Grid2Props) => {
  const { camera, viewport } = useThree()
  const [boundary, setBoundary] = useState<Boundary>(
    createBoundary(camera.position.clone(), viewport.width, viewport.height)
  )
  const magnitude = Math.log10(boundary.width)
  const scale = Math.round(magnitude)
  const nextMag = magnitude - scale, currentMag = 1 - nextMag
  const leftEdge = camera.position.x - boundary.width/2
  const bottomEdge = camera.position.y - boundary.height/2
  const step = 10**(scale-2), 
    xStart = Math.trunc((leftEdge + step) / step) * step,
    yStart = Math.trunc((bottomEdge + step) / step) * step,
    xEnd = Math.trunc((leftEdge + boundary.width - step) / step) * step,
    yEnd = Math.trunc((bottomEdge + boundary.height - step) / step) * step
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
  console.info({magnitude, scale, currentMag, nextMag})
  console.info({leftEdge, bottomEdge})
  console.info({step, xStart, yStart, xEnd, yEnd})
  console.info({xSubdivisions, ySubdivisions})

  const segments: Segment[] = []
  const black = new Color(0,0,0), white = new Color(1,1,1)

  for(let x = xStart; x <= xEnd; x += step){
    segments.push({
      start: new Vector3(x, yStart+step, 0),
      end: new Vector3(x, yEnd-step, 0),
      color: white.lerp(black, currentMag)
    })
    // segments.push([
    //   new Vector3(x, yStart+step, 0), 
    //   new Vector3(x, yEnd-step, 0),
    //   new Color()
    // ])
  }
  for(let y = yStart; y <= yEnd; y += step){
    segments.push({
      start: new Vector3(xStart-step, y, 0),
      end: new Vector3(xEnd+step, y, 0),
      color: white.lerp(black, currentMag)
    })
  }

  console.log(segments)

  return <Segments limit={segments.length}>
    {
      segments.map(({start, end, color}, i) => (
        <Segment start={start} end={end} color={color} key={i} />
      ))
    }
  </Segments>
}
