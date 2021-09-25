declare const handleMove: ({ deltaXY }: GesturestreamEventGesture) => ({ origin: [oldX, y, oldZ], coords: [r, , phi] }: CameraState) => {
    origin: any[];
};
declare const handleRotate: ({ deltaXY, targetSize }: GesturestreamEventGesture) => ({ minTheta, maxTheta, rotationScale, coords: [r, oldTheta, oldPhi] }: CameraState) => {
    coords: any[];
};
declare const handleWheel: (event: PointerEvent) => (({ origin: [oldX, y, oldZ], coords: [r, , phi] }: CameraState) => {
    origin: any[];
}) | (({ minR, maxR, minTheta, maxTheta, rotationScale, coords: [oldR, oldTheta, oldPhi] }: CameraState) => {
    coords: number[];
});
declare const handlePinch: ({ deltaXY, deltaAngle, deltaDistance }: GesturestreamEventGesture) => (state: CameraState) => {
    origin: any[];
    coords: any[];
};
export { handleMove, handleRotate, handleWheel, handlePinch };
