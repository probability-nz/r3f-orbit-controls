import { useCamera, ControlRig, OrbitCamera } from 'r3f-orbit-controls'
import { Canvas, useThree } from '@react-three/fiber'
import Buttons from './Buttons'

import { Raycaster, Vector2} from 'three'

const onGesture =
  ({ event, gesture, raycaster }, scene) => {
    const intersects = raycaster.intersectObjects(scene.children, true)
    console.log(...intersects)

    const { type, pointerType } = event
    const {
      touches,
      buttons: [leftButton, rightButton, middleButton]
    } = gesture
    const camera = useCamera.getState()

    if (type === 'wheel') {
      camera.handleWheel(event)
    } else if (type === 'pointermove') {
      if (pointerType === 'touch' && touches === 2) {
        camera.handlePinch(gesture)
      } else if (rightButton) {
        camera.handleRotate(gesture)
      } else if (leftButton || middleButton || pointerType === 'touch') {
        camera.handleMove(gesture)
      }
    }
  }

const Box = ({ color, ...props }) => (
  <mesh {...props}>
    <boxGeometry />
    <meshStandardMaterial color={color} />
  </mesh>
)

const Scene = () => {
  const scene = useThree(s => s.scene)
  return (
    <>
      <ControlRig onGesture={e => onGesture(e, scene)} />
      <OrbitCamera />
      <ambientLight />
      <mesh scale={10} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry />
        <meshStandardMaterial color="grey" />
      </mesh>
      <Box color="red" position={[0, 0.5, 0]} />
      <Box color="blue" position={[1, 0.5, 0]} />
      <Box color="green" position={[-1, 0.5, 0]} />
    </>
  )
}

const App = () => (
  <div>
    <Canvas
      style={{
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        left: 0,
        top: 0
      }}
      children={<Scene />}
    />
    <Buttons
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: '2em'
      }}
    />
  </div>
)

export default App
