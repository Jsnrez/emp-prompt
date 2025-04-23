<script setup>
import { computed, ref } from 'vue';
import { marked } from 'marked';
//TODO: Consider doing cusotm markdown w/regex

const props = defineProps({
    element: {
        type: Object,
        required: true
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});

//See EditorPrimary, event for updating its state
const emit = defineEmits(['select-element', 'update-element-position']);

const isDragging = ref(false); // Track dragging state locally for cursor style
let dragStartX = 0;
let dragStartY = 0;
let initialMouseX = 0;
let initialMouseY = 0;

/**
 * Computed Properties
 */
// Output to Slide
const renderedHtml = computed(() => {
    if (props.element.type === 'text' && props.element.content) {
        return marked.parse(props.element.content);
    }
    return '';
});

// Active Styles
const elementStyle = computed(() => ({
    position: 'absolute',
    left: `${props.element.x}px`,
    top: `${props.element.y}px`,
    width: `${props.element.width}px`,
    height: props.element.type === 'image' ? `${props.element.height}px` : 'auto',
    minHeight: props.element.type === 'text' ? `${props.element.height}px` : undefined,
    border: props.isSelected ? '2px dashed blue' : '1px solid transparent',
    overflow: 'hidden',
    cursor: isDragging.value ? 'grabbing' : 'grab',
    userSelect: 'none',
    zIndex: isDragging.value ? 1000 : 1
}));

// --- Event Handlers ---
const onMouseDown = (event) => {

    if (event.button !== 0) return;
    event.preventDefault();
    emit('select-element', props.element.id);

    // prep dragging
    isDragging.value = true;
    dragStartX = props.element.x;
    dragStartY = props.element.y;
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;

    // Update coordinates & more
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

const onMouseMove = (event) => {
    if (!isDragging.value) return;

    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;

    const newX = dragStartX + deltaX;
    const newY = dragStartY + deltaY;

    // Emit position
    emit('update-element-position', {
        id: props.element.id,
        x: newX,
        y: newY
    });
}

const onMouseUp = () => {
    if (isDragging.value) {
        isDragging.value = false;

        // Remove event listeners
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

    }
}

</script>

<template>
    <div :style="elementStyle" @mousedown.stop="onMouseDown">
        <img v-if="element.type === 'image'" :src="element.src" class="preview-el p-5px" draggable="false" />
        <div v-else-if="element.type === 'text'" v-html="renderedHtml" class="preview-el text-box object-contain prose"
            style="width: 100%; height: 100%; pointer-events: none;"></div>
    </div>
</template>

<style scoped>
.preview-el {
    height: 100%;
    width: 100%;
    display: block;
}

</style>