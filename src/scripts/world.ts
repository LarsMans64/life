import {clamp, Vec} from "@/scripts/math.ts";
import {camera, worldToScreen} from "@/scripts/camera.ts";
import {dudeInfo, simulationSpeed} from "@/scripts/global.ts";

export interface Dude {
    pos: Vec
    vel: Vec
    acc: Vec
    family: number
}

const beefSpread = 20;
const beefStrength = 4;
const collideStrength = 50;
const dudeRadius = .3;
const dudeMass = Math.PI * dudeRadius ** 2;

const dudes: Dude[] = makeDudes(50, 4);

type FamilyBeef = Map<number, Map<number, number>>;

let familyBeef: FamilyBeef = new Map([
    [1, new Map([[1, 6], [2, 10], [3, 10], [4, -5]])],
    [2, new Map([[1, -20], [2, 0], [3, -20], [4, 20]])],
    [3, new Map([[1, -7], [2, 0], [3, 15], [4, -3]])],
    [4, new Map([[1, -10], [2, 1], [3, 0], [4, 8]])],
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
                const force = relative.withLength((beefStrength * beef) * (dudeMass ** 2) / (relative.length() ** 2));
                const no = relative.withLength(collideStrength * ((dudeMass ** 2)) / (relative.length() ** 6));
                const total = force.sub(no);
                dude.acc = dude.acc.add(total.withLength(Math.min(1000, total.length())));
            }
        }

        dude.vel = dude.vel.add(dude.acc.scale(dt));

        const velMax = 20 ** dudeRadius;

        dude.vel = dude.vel.withLength(Math.min(dude.vel.length(), velMax));


        dude.pos = dude.pos.add(dude.vel.scale(dt));

        const bound = 20;
        if (dude.pos.x > bound || dude.pos.x < -bound) dude.vel.x = -dude.vel.x;
        if (dude.pos.y > bound || dude.pos.y < -bound) dude.vel.y = -dude.vel.y;

        dude.pos.x = clamp(-bound, dude.pos.x, bound);
        dude.pos.y = clamp(-bound, dude.pos.y, bound);

        // Prevent NaN explosion
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

export function randomizeFamilyBeef() {
    const families = 4;
    familyBeef = new Map();
    for (let i = 0; i < families; i++) {
        const family = new Map<number, number>();
        for (let j = 0; j < families; j++) {
            family.set(j, (Math.random() - 0.5) * 2 * beefSpread);
        }
        familyBeef.set(i, family);
    }
}
