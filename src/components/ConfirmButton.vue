<script setup>
import { onBeforeUnmount, ref } from 'vue';
import SimButton from './SimButton.vue'

const _hideConfrim = ref(true);

const model = defineModel({ default: true })

const emit = defineEmits(['close', 'confirm', 'negative']);

function handleNegative() {
    model.value = true;
    emit('negative');
}

onBeforeUnmount(() => {
    // model.value = true;
})

</script>

<template>
    <template v-if="model">
        <SimButton @click="model = false">
            <slot></slot>
        </SimButton>
    </template>
    <template v-else>
        <div class="confirm-group">
            <button class="hover:bg-gray-300 px-2 py-1" @click="handleNegative">
                Cancel
            </button>
            <button class="bg-violet-600 hover:bg-violet-500 px-2 py-1 text-white" @click="emit('confirm')">
                Confirm
            </button>
        </div>

    </template>

</template>

<style scoped>
.confirm-group {
    display: flex;
    justify-content: center;
    
}
.confirm-group button {
    border: 1px solid black;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
    border-radius: .25rem;
}
.confirm-group button:first-child {
    border-right: .5px;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
}

.confirm-group button:last-child {
    border-left: .5px;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
}
</style>