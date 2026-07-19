import {clamp, Vec} from "@/scripts/math.ts";
import {camera, worldToScreen} from "@/scripts/camera.ts";
import {dudeInfo, simulationSpeed} from "@/scripts/global.ts";

export interface Dude {
    pos: Vec
    vel: Vec
    acc: Vec
    family: number
}

const beefStrength = 4;
const collideStrength = 50;
const dudeRadius = .3;
const dudeMass = Math.PI * dudeRadius ** 2;

const dudes: Dude[] = makeDudes(70, 4);

const familyBeef: Map<number, Map<number, number>> = new Map([
    [1, new Map([[1, 6], [2, 10], [3, 10], [4, -5]])],
    [2, new Map([[1, -20], [2, -4], [3, 4], [4, 3]])],
    [3, new Map([[1, -7], [2, 0], [3, 15], [4, -3]])],
    [4, new Map([[1, 20], [2, 1], [3, 0], [4, 3]])],
]);

const colors: Map<number, string> = new Map([
    [1, "#2277bb"],
    [2, "#22bb52"],
    [3, "#f4e455"],
    [4, "#f48d55"],
]);

export function updateWorld(dt: number) {

    dt *= simulationSpeed.value;

    for (const [i, dude] of dudes.entries()) {
        dude.acc = new Vec(0, 0);

        for (const other of dudes) {
            if (other !== dude) {
                const beef = familyBeef.get(dude.family)?.get(other.family) ?? 0;
                const relative = other.pos.sub(dude.pos);
                const force = relative.normalize().scale((beefStrength * beef) * (dudeMass ** 2) / (relative.length() ** 2));
                const no = relative.normalize().scale(collideStrength * ((dudeMass ** 2)) / (relative.length() ** 4));
                const total = force.sub(no);
                dude.acc = dude.acc.add(total.normalize().scale(Math.min(1000, total.length())));
            }
        }

        // continue

        // dude.vel = dude.vel.scale(0.99 ** dt);

        dude.vel = dude.vel.add(dude.acc.scale(dt));

        const velMax = 15 ** dudeRadius;
        dude.vel.x = clamp(-velMax, dude.vel.x, velMax);
        dude.vel.y = clamp(-velMax, dude.vel.y, velMax);


        dude.pos = dude.pos.add(dude.vel.scale(dt));

        const bound = 20;
        if (dude.pos.x > bound || dude.pos.x < -bound) dude.vel.x = -dude.vel.x;
        if (dude.pos.y > bound || dude.pos.y < -bound) dude.vel.y = -dude.vel.y;

        dude.pos.x = clamp(-bound, dude.pos.x, bound);
        dude.pos.y = clamp(-bound, dude.pos.y, bound);

        // console.log(dude.pos.x)

        // Prevent NaN
        if (!dude.pos.x || !dude.pos.y) {
            dudes.splice(i, 1)
        }
    }

    dudeInfo.value.count = dudes.length;
}

export function drawWorld(ctx: CanvasRenderingContext2D) {
    for (const dude of dudes) {
        let camPos = worldToScreen(dude.pos);
        ctx.fillStyle = colors.get(dude.family) ?? "#d3d3d3";
        ctx.beginPath();
        ctx.arc(camPos.x, camPos.y, dudeRadius * camera.zoom, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

function makeDudes(count: number, families: number) {
    const dudes: Dude[] = []
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < families; j++) {
            dudes.push(makeDude(new Vec(40 * i / count - 20, 40 * j / families - 20), j + 1));
        }
    }
    return dudes;
}

function makeDude(pos: Vec, family: number) {
    return {
        pos,
        vel: new Vec(0, 0),
        acc: new Vec(0, 0),
        family,
    }
}
