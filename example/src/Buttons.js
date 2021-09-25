import { useCamera } from 'r3f-orbit-controls'

const moveRight = ({ origin: [x, y, z], coords }) => ({
  origin: [x + 1, y, z],
  coords
})

const Buttons = props => (
  <div {...props}>
    <button
      children="🏠"
      style={{ fontSize: 'inherit' }}
      onClick={() => useCamera.getState().resetPosition()}
    />
    <button
      children="⬇️"
      style={{ fontSize: 'inherit' }}
      onClick={() => useCamera.getState().updatePosition(moveRight)}
    />
  </div>
)

export default Buttons
