import { memo, useCallback, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gesturestream from './gesturestream'
import flydDomEvents from 'flyd-dom-events'
import { Raycaster, Vector2 } from 'three'

interface ControlRigProps {
  onGesture: any
  domTarget?: HTMLElement
}

// Handle interaction events on a DOM object
const ControlRig = memo(({ onGesture, domTarget }: ControlRigProps) => {
  const target = useThree(
    useCallback(s => domTarget || s.gl.domElement, [domTarget])
  )
  const camera = useThree(s => s.camera)

  // PreventDefault on certain events
  useEffect(() => {
    if (!target) return
    const stream = flydDomEvents(
      [
        'wheel', // Prevent ctrl-zoom/alt-history gestures
        'touchstart', // https://pqina.nl/blog/blocking-navigation-gestures-on-ios-13-4/
        'contextmenu' // use long-press/right-click instead (as no iOS support)
      ],
      target
    ).map((event: PointerEvent) => event.preventDefault())
    return () => {
      stream.end(true)
    }
  }, [target])

  // Connect gesture handler
  useEffect(() => {
    if (!target) return
    const raycaster = new Raycaster()
    const coords = new Vector2()
    const stream = gesturestream(target)
      .map((e: any) => {
        // Update raycaster
        const { center, targetSize } = e.gesture
        coords.set(
          (center[0] / targetSize[0]) * 2 - 1,
          -(center[1] / targetSize[1]) * 2 + 1
        )
        raycaster.setFromCamera(coords, camera)
        return { raycaster, ...e }
      })
      .map(onGesture)
    return () => {
      stream.end(true)
    }
  }, [target, onGesture])

  return null
})

export default ControlRig
