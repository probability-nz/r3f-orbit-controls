import create from 'zustand'
import { compose } from 'ramda'
import { handleMove, handleRotate, handleWheel, handlePinch } from './handlers'

const useCamera = create((set, get) => ({
  // Config
  minR: 1,
  maxR: Infinity,
  minTheta: 0.03,
  maxTheta: Math.PI / 2,
  rotationScale: [Math.PI * 4, Math.PI * 1],
  initialOrigin: [0, 0.5, 0],
  initialCoords: [15, Math.PI / 8, Math.PI / 4],

  // Handlers
  handleWheel: compose(set, handleWheel),
  handleMove: compose(set, handleMove),
  handleRotate: compose(set, handleRotate),
  handlePinch: compose(set, handlePinch),

  updatePosition: (updater: (state: CameraState) => CameraState) =>
    set(({ origin, coords, initialOrigin, initialCoords }: CameraState) => {
      const result = updater({
        origin,
        coords,
        initialOrigin,
        initialCoords
      })
      return {
        origin: result.origin || origin,
        coords: result.coords || coords
      }
    }),

  resetPosition: () => {
    set((state: CameraState) =>
      state.updatePosition(({ initialOrigin, initialCoords }: CameraState) => ({
        origin: initialOrigin,
        coords: initialCoords
      }))
    )
  },

  // origin/coords are set from initial state in a resetPosition call below
  origin: [0, 0, 0],
  coords: [0, 0, 0]
}))

// Set initial coords
// @ts-ignore
useCamera.getState().resetPosition()

export default useCamera
