<script setup lang="ts">
import {onMounted, useTemplateRef} from "vue";
import {
  drawWorld,
  familyBeefToString,
  randomizeFamilyBeef,
  readFamilyBeef,
  resetDudes,
  updateWorld
} from "@/scripts/world.ts";
import {setupCamera, updateCamera} from "@/scripts/camera.ts";
import {dudeInfo, options} from "@/scripts/global.ts";

const canvas = useTemplateRef("canvas");

setupCamera();

onMounted(() => {
  update();
});

let then = Date.now();

function update() {
  const now = Date.now();
  const dt = Math.min(now - then, 100) / 1000;
  then = now;

  window.requestAnimationFrame(update);

  if (!canvas.value) return;

  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  updateCamera(dt);
  updateWorld(dt);

  drawWorld(ctx);
}

function copySettings() {
  navigator.clipboard.writeText(familyBeefToString());
}

function pasteSettings() {
  navigator.clipboard.readText().then(value => readFamilyBeef(value));
}
</script>

<template>
  <canvas ref="canvas"></canvas>
  <div class="hud">
    <div>
      Pan = right click
    </div>
    <div class="slider">
      <label for="speed">Simulation speed: {{ options.simulationSpeed }}</label>
      <input v-model="options.simulationSpeed" id="speed" type="range" min="0" max="5" step="0.5">
    </div>
    <div>
      {{ dudeInfo.count }} cells
    </div>
    <div>
      <button @click="randomizeFamilyBeef">Randomize forces</button>
    </div>
    <div>
      <button @click="copySettings">Copy forces</button>
    </div>
    <div>
      <button @click="pasteSettings">Paste forces</button>
    </div>
    <div class="checkbox">
      <input v-model="options.worldBounds" id="bounds" type="checkbox">
      <label for="bounds">Use world border</label>
    </div>
    <div class="checkbox">
      <input v-model="options.centerGravity" id="gravity" type="checkbox">
      <label for="gravity">Center gravity</label>
    </div>
    <div>
      <button @click="resetDudes">Reset cells</button>
    </div>
  </div>
</template>

<style scoped>
canvas {
  background-color: transparent;
}

.hud {
  position: fixed;
  margin: .5rem;
  padding: 1rem;

  min-width: 15rem;

  backdrop-filter: blur(15px);
  background: var(--col-bg-2);
  border: 1px solid var(--col-border-1);
  border-radius: 15px;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.slider {
  display: flex;
  flex-direction: column;
  align-items: start;
}

button {
  backdrop-filter: blur(15px);
  background: var(--col-bg-2);
  border: 1px solid var(--col-border-1);
  border-radius: 8px;

  font: inherit;
  cursor: pointer;
  padding: .2rem .5rem;

  transition: background-color 100ms ease-out;

  &:hover {
    background: var(--col-bg-3);
    border: 1px solid var(--col-border-2);
  }

  &:active {
    background: var(--col-bg-4);
    border: 1px solid var(--col-border-3);
  }
}

.checkbox {
  display: flex;
  gap: .8rem;
}
</style>
