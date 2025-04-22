<script setup>
import { inject } from 'vue';
import SlidePreviewRenderer from './SlidePreviewRenderer.vue';

const props = defineProps({
    slides: {
        type: Array,
        default: [],
    }
})

const emit = defineEmits(['belt-select-slide'])

const previewDisplayType = 'rectangle';

const setSlideForEditor = inject('editorSetSlide');

</script>
<template>
    <div class="overflow-hidden" :style="{ 'scroll-direction': 'horizontal' }">

        <div class="slide-belt" :class="'preview-type--' + previewDisplayType">
            <template v-if="slides && slides.length > 0">
                <div v-for="(slide, index) in slides" :key="slide.id" class="slide-preview-item-wrapper"
                    @click="setSlideForEditor(slide.id)" @keydown.enter="selectSlide(slide.id)"
                    @keydown.space.prevent="selectSlide(slide.id)" tabindex="0" role="button"
                    :aria-label="`Select slide ${index + 1}: ${slide.title || slide.id}`">
                    <span class="slide-index">{{ index + 1 }}</span>

                    <SlidePreviewRenderer :elements="slide.elements" :preview-type="previewDisplayType" />

                    <span v-if="slide.title" class="slide-title-below">{{ slide.title || 'Untitled Slide' }}</span>

                </div>
            </template>
            <div v-else class="empty-belt-message">
                No slides to display.
            </div>
        </div>

    </div>
</template>

<style scoped>
.slide-preview-item-wrapper {
    flex-shrink: 0;
    cursor: pointer;
    text-align: center;
    position: relative;
    padding-top: 18px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preview-type--rectangle .slide-preview-item-wrapper {
    width: 120px;
}

.preview-type--square .slide-preview-item-wrapper {
    width: 80px;
}


.slide-preview-item-wrapper:hover,
.slide-preview-item-wrapper:focus {
    transform: translateY(-2px);
    outline: none;
}

.slide-preview-item-wrapper:focus-within {
    box-shadow: 0 0 0 2px dodgerblue;
    border-radius: 3px;
}

.slide-index {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7em;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 1px 5px;
    border-radius: 5px;
}

.slide-title-below {
    display: block;
    font-size: 0.75em;
    margin-top: 4px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.slide-belt {
    display: flex;
    overflow-x: scroll;
    gap: 15px;
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    min-height: 90px;
    align-items: flex-start;
}

.preview-type--square .slide-belt {
    min-height: 110px;
}

.preview-type--rectangle .slide-belt {
    min-height: 95px;
}

.empty-belt-message {
    padding: 20px;
    text-align: center;
    color: #777;
    background-color: #f9f9f9;
    border: 1px solid #eee;
}

.slide-belt::-webkit-scrollbar {
    height: 8px;
}

.slide-belt::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 4px;
}

.slide-belt::-webkit-scrollbar-thumb:hover {
    background: #888;
}
</style>