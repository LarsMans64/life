import {lerpSmooth, Vec} from "@/scripts/math.ts";
import {useEventListener} from "@vueuse/core";

export const camera = {
    pos: new Vec(0, 0), // position = middle of the screen
    targetPos: new Vec(0, 0),
    zoom: 20,
    targetZoom: 20,
    zoomStep: 0.9,
}

export function setupCamera() {
    useEventListener("mousemove", (e) => {
        if (e.buttons == 2 || e.buttons == 4) {
            setCameraTo(camera.pos.sub(new Vec(e.movementX, e.movementY).scale(1 / camera.zoom)));
        }
    })

    useEventListener('wheel', function(e) {
        let newZoom = e.deltaY > 0
            ? camera.targetZoom * camera.zoomStep
            : camera.targetZoom / camera.zoomStep;

        const cursor = screenToWorld(new Vec(e.clientX, e.clientY));
        const camToCursor = cursor.sub(camera.pos);
        const move = camToCursor.scale(1 - camera.targetZoom / newZoom);
        easeCameraTo(camera.targetPos.add(move));

        camera.targetZoom = newZoom;
    })

    useEventListener("contextmenu", e => e.preventDefault())
}

export function updateCamera(dt: number) {
    camera.pos = camera.pos.approach(camera.targetPos, dt, 0.1);
    camera.zoom = lerpSmooth(camera.zoom, camera.targetZoom, dt, 0.1);
}

export function setCameraTo(coord: Vec) {
    camera.pos = coord;
    camera.targetPos = coord;
}

export function easeCameraTo(coord: Vec) {
    camera.targetPos = coord;
}

export function worldToScreen(coord: Vec) {
    const screenMiddle = new Vec(window.innerWidth / 2, window.innerHeight / 2);
    return coord.sub(camera.pos).scale(camera.zoom).add(screenMiddle);
}

export function screenToWorld(coord: Vec) {
    const screenMiddle = new Vec(window.innerWidth / 2, window.innerHeight / 2);
    return coord.sub(screenMiddle).scale(1 / camera.zoom).add(camera.pos);
}