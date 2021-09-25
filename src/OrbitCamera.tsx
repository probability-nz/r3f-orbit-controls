import { useEffect, useRef, memo } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import useCamera from './useCamera'
import {
  PerspectiveCamera as PerspectiveCameraType,
  Group as GroupType
} from 'three'

type PerspectiveCameraProps = JSX.IntrinsicElements['perspectiveCamera'] & {
  // Props set by OrbitCamera
  ref: undefined
  rotation: undefined
  // Props from Drei/PerspectiveCamera
  // TODO: Import Drei PerspectiveCamera type directly
  makeDefault?: boolean
  manual?: boolean
  children?: React.ReactNode
}

// Camera bound to origin/coords state
const OrbitCamera = memo((props: PerspectiveCameraProps) => {
  const invalidate = useThree(s => s.invalidate)
  const groupRef = useRef()
  const cameraRef = useRef()

  useEffect(() => {
    const update = ({
      // Target position
      origin: [x, y, z],
      coords: [
        r, // Distance to origin
        theta, // Polar (up-down) angle
        phi // Azimuthal (left-right) angle
      ]
    }: CameraState) => {
      const group = groupRef.current as GroupType | undefined
      const camera = cameraRef.current as PerspectiveCameraType | undefined
      if (group && camera) {
        group.position.set(x, y, z)
        camera.position.x = r
        group.rotation.z = theta
        group.rotation.y = phi
        invalidate()
      }
    }
    update(useCamera.getState() as CameraState)
    return useCamera.subscribe(update)
  }, [invalidate])

  return (
    <group ref={groupRef}>
      <PerspectiveCamera
        makeDefault
        {...props}
        ref={cameraRef}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  )
})

export default OrbitCamera
