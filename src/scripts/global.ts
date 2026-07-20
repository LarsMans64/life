import {reactive, ref} from "vue";

export const options = reactive({
    simulationSpeed: 1,
    worldBounds: false,
    centerGravity: true,
})

export const dudeInfo = ref({
    count: 0,
});