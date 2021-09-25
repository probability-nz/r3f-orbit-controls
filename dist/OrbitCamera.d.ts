/// <reference types="react" />
declare type PerspectiveCameraProps = JSX.IntrinsicElements['perspectiveCamera'] & {
    ref: undefined;
    rotation: undefined;
    makeDefault?: boolean;
    manual?: boolean;
    children?: React.ReactNode;
};
declare const OrbitCamera: import("react").MemoExoticComponent<(props: PerspectiveCameraProps) => JSX.Element>;
export default OrbitCamera;
