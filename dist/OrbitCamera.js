import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, memo } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import useCamera from './useCamera';
// Camera bound to origin/coords state
const OrbitCamera = memo((props) => {
    const invalidate = useThree(s => s.invalidate);
    const groupRef = useRef();
    const cameraRef = useRef();
    // Set initial origin & coords
    useEffect(() => {
        ;
        useCamera.getState().resetPosition();
    }, []);
    // Update Three camera with Zustand subscription
    useEffect(() => {
        const update = ({ 
        // Target position
        origin: [x, y, z], coords: [r, // Distance to origin
        theta, // Polar (up-down) angle
        phi // Azimuthal (left-right) angle
        ] }) => {
            const group = groupRef.current;
            const camera = cameraRef.current;
            if (group && camera) {
                group.position.set(x, y, z);
                camera.position.x = r;
                group.rotation.z = theta;
                group.rotation.y = phi;
                invalidate();
            }
        };
        update(useCamera.getState());
        return useCamera.subscribe(update);
    }, [invalidate]);
    return (_jsx("group", Object.assign({ ref: groupRef }, { children: _jsx(PerspectiveCamera, Object.assign({ makeDefault: true }, props, { ref: cameraRef, rotation: [0, Math.PI / 2, 0] }), void 0) }), void 0));
});
export default OrbitCamera;
