<script setup>
import { ref, computed } from 'vue';
import { usePresentationStore } from '../stores/presentationStore';
import { useFullscreenPresentation } from '../composables/useFullscreenPresentation';
import SlideRenderer from './SlideRenderer.vue';

const presentationStore = usePresentationStore();

// Ref for the container element - passed to the composable
const presenterContainerRef = ref(null);

// Fullscreen Composable
const { isFullscreenActive, enterFullscreen, exitFullscreen } = useFullscreenPresentation(presenterContainerRef);

const currentSlide = computed(() => presentationStore.currentSlide);
const progressText = computed(() => presentationStore.progressText);

</script>

<template>
    <div>
        <!-- Present Button -->
        <button title="Start Presentation" class="bg-white hover:bg-gray-200 text-gray-800 py-2 px-4 rounded" @click="enterFullscreen" :disabled="isFullscreenActive">Start Presentation
        </button>
        <!-- Fullscreen Container -->
        <div ref="presenterContainerRef" class="presenter-container"
            :class="{ 'fullscreen-active': isFullscreenActive }">
            <div v-if="currentSlide" class="slide-content-wrapper">
                <SlideRenderer :slide-elements="currentSlide.elements" />
            </div>
            <div v-else class="no-slide-message">
                No slide selected or presentation is empty.
            </div>

            <div v-if="isFullscreenActive" class="progress-indicator bg-purple-50"> {{ progressText }} </div>

            <button v-if="isFullscreenActive" @click="exitFullscreen" class="exit-fullscreen-button">
                Exit (Esc)
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Hides by default */
.presenter-container {
    display: none;
    position: relative;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    min-height: 400px;
    margin-top: 10px;
}

.slide-content-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.slide-render-area {
    padding: 20px;
    background: white;
}

.no-slide-message {
    padding: 50px;
    text-align: center;
    color: #666;
}

/* Styles for fullscreen-active */
.presenter-container.fullscreen-active {
    width: 100%;
    height: 100%;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
}

.presenter-container.fullscreen-active .slide-content-wrapper {
    width: 95%;
    height: 95%;
    max-width: 100vw;
    max-height: 100vh;
}

.presenter-container.fullscreen-active .slide-render-area {
    width: 100%;
    height: 100%;
    background: #111;
    color: #eee;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.presenter-container.fullscreen-active .slide-render-area pre {
    color: #ccc;
    background-color: #222;
    padding: 1em;
    border-radius: 5px;
}


/* Progress CSS */
.presenter-container.fullscreen-active .progress-indicator {
    display: block;
    position: absolute;
    bottom: 2vh;
    right: 50%;
    background-color: rgba(50, 50, 50, 0.7);
    color: white;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 1.30em;
    z-index: 100;
}

.presenter-container.fullscreen-active .exit-fullscreen-button {
    display: block;
    position: absolute;
    top: 2vh;
    right: 2vw;
    background-color: rgba(50, 50, 50, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 100;
    font-size: 1em;
}

.presenter-container.fullscreen-active .exit-fullscreen-button:hover {
    background-color: rgba(80, 80, 80, 0.9);
}

</style>