interface CameraState {
  minR?: number
  maxR?: number
  minTheta?: number
  maxTheta?: number
  rotationScale?: Vec2
  initialOrigin?: Vec3
  initialCoords?: Vec3
  handleWheel?: function
  handleMove?: function
  handleRotate?: function
  handlePinch?: function
  updatePosition?: function
  resetPosition?: function
  coords?: Vec3
  origin?: Vec3
}
