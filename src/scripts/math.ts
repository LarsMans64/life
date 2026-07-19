export function clamp(a: number, b: number, c: number) {
    return Math.max(a, Math.min(b, c));
}

export function lerpSmooth(a: number, b: number, dt: number, speed: number) {
    return b + (a - b) * Math.exp(- dt / speed);
}

export class Vec {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vec) {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }

    sub(vec: Vec) {
        return new Vec(this.x - vec.x, this.y - vec.y);
    }

    scale(scalar: number) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let length = this.length()
        return new Vec(this.x / length, this.y / length);
    }

    setAngle(radians: number) {
        length = this.length();
        return new Vec(Math.cos(radians) * length, Math.sin(radians) * length);
    }

    getAngle() {
        return Math.atan(this.y / this.x);
    }

    approach(vec: Vec, dt: number, speed: number) {
        return new Vec(
            lerpSmooth(this.x, vec.x, dt, speed),
            lerpSmooth(this.y, vec.y, dt, speed),
        );
    }
}