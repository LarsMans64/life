<script setup lang="ts">
import {onMounted, ref, useTemplateRef} from "vue";
import {drawWorld, updateWorld} from "@/scripts/world.ts";
import {setupCamera, updateCamera} from "@/scripts/camera.ts";
import {dudeInfo, simulationSpeed} from "@/scripts/global.ts";

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
</script>

<template>
  <canvas ref="canvas"></canvas>
  <div class="hud">
    <div>
      Pan = right click
    </div>
    <div class="slider">
      <label for="speed">Simulation speed: {{ simulationSpeed }}</label>
      <input v-model="simulationSpeed" id="speed" type="range" min="0" max="5" step="0.5">
    </div>
    <div>
      {{ dudeInfo.count }} cells
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
  background: rgb(31 36 43 / 0.39);
  border: 1px solid rgb(53 83 87 / 0.3);
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
</style>
