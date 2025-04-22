<script setup>
import { computed } from 'vue';

// 16 / 9 dimensions
const wideSc_width = 960;
const wideSc_height = 540;

// Define the pixel dimensions for our preview types
const preview_dimensions = {
    square: { width: 80, height: 80 },
    // Keep rectangle preview at 16:9 aspect ratio for consistency
    rectangle: { width: 120, height: 120 * 9 / 16 },
};

const props = defineProps({
    // Array of element objects for a single slide
    elements: {
        type: Array,
        required: true,
        default: () => []
    },
    previewType: {
        type: String,
        default: 'rectangle',
        validator: (value) => ['square', 'rectangle'].includes(value)
    }
});

/**
 * Computed Properties
 */

// Get target dimensions based on previewType
const targetDimensions = computed(() => {
    return preview_dimensions[props.previewType] || preview_dimensions.rectangle;
});

// Calculate dimensions
const scaleFactor = computed(() => {
    const targetW = targetDimensions.value.width;
    const targetH = targetDimensions.value.height;
    const scaleX = targetW / wideSc_width;
    const scaleY = targetH / wideSc_height;
    return Math.min(scaleX, scaleY);
});

const wrapperStyle = computed(() => ({
    width: `${targetDimensions.value.width}px`,
    height: `${targetDimensions.value.height}px`,
}));

const canvasStyle = computed(() => ({
    width: `${wideSc_width}px`,   // Use OG dimensions here, then scale down
    height: `${wideSc_height}px`,
    position: 'relative',
    transform: `scale(${scaleFactor.value})`,
    transformOrigin: 'top left',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
}));


// Slide Elements Styles
const getElementStyle = (element) => ({
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    boxSizing: 'border-box',
});

</script>

<template>
    <div class="preview-wrapper" :style="wrapperStyle">
        <div class="preview-inner" :style="canvasStyle">
            <div v-for="element in elements" :key="element.id" :style="getElementStyle(element)" class="preview-element"
                :class="'preview-element--' + element.type">
                <template v-if="element.type === 'text'">
                    <span class="text-content">{{ element.content }}</span>
                </template>
                <template v-else-if="element.type === 'image'">
                    <div class="image-placeholder-content"></div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview-wrapper {
    border: 1px solid #ccc;
    overflow: hidden;
    background-color: white;
    box-sizing: border-box;
    /* Prevent interaction */
    pointer-events: none;
    user-select: none;
}

.preview-inner {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preview-element {
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Text Styles */
.preview-element--text {
    display: flex;
    align-items: flex-start;
}

.preview-element--text .text-content {
    padding: 2px 4px;
    font-size: 10px;
    line-height: 1.1;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: hidden;
    color: #222;
    display: block;
    width: 100%;
    height: 100%;
}

/* Image Styles */
.preview-element--image {
    border: 1px dashed #666;
}

.preview-element--image .image-placeholder-content {
    width: 100%;
    height: 100%;
    background: #2A7B9B;
    background: linear-gradient(130deg, rgb(74 42 155) 0%, rgb(189 87 199) 50%, rgb(237 231 83) 100%)
}
</style>