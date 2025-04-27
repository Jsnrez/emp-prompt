import { ref, watch, onMounted, onUnmounted, readonly } from 'vue';
import { usePresentationStore } from '../stores/presentationStore';

// Composable accepts the template ref of the container element
export function useFullscreenPresentation(containerRef) {

  const presentationStore = usePresentationStore();
  const isFullscreenActive = ref(false); // Local state

  /** Fullscreen API Methods */
  const enter = () => {
    const element = containerRef.value;
    if (!element) {ß
        console.error("Fullscreen container element not found.");
        return;
    }
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => console.error(`Error attempting fullscreen: ${err.message}`));
    } else if (element.webkitRequestFullscreen) { element.webkitRequestFullscreen(); }
    else if (element.msRequestFullscreen) { element.msRequestFullscreen(); }
  };

  const exit = () => {
    if (!isFullscreenActive.value) return; // Don't try exiting if not fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.error(`Error exiting fullscreen: ${err.message}`));
    } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    else if (document.msExitFullscreen) { document.msExitFullscreen(); }
  };

  /** Event Handlers */
  const handleKeyDown = (event) => {
    // Check isFullscreenActive directly, as listener is attached/detached based on it
    if (!isFullscreenActive.value) return;

    switch (event.key) {
      case 'ArrowRight': case ' ':
        event.preventDefault();
        presentationStore.nextSlide();
        break;
      case 'ArrowLeft':
        console.log('Arrow left')
        event.preventDefault();
        presentationStore.previousSlide();
        break;
      // Escape is handled by browser automatically
    }
  };

  // Move presentation forward or back depending on Mouse Location
  const handleClick = (event) => {
    if (!isFullscreenActive.value || !containerRef.value) return;

    const clickX = event.clientX;
    const containerRect = containerRef.value.getBoundingClientRect();
    const middleX = containerRect.left + containerRect.width / 2;
    // ClickX - X-axis
    if (clickX > middleX) {
      presentationStore.nextSlide();
    } else {
      presentationStore.previousSlide();
    }
  };

  /** Fullscreen Change Listener */
  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

    if (isFullscreenActive.value !== isCurrentlyFullscreen) {
        isFullscreenActive.value = isCurrentlyFullscreen;
         console.log("Fullscreen state updated in composable:", isCurrentlyFullscreen);
    }
  };

  // This Watcher adds/removes listeners for keys and mouse clicks
  watch(isFullscreenActive, (isNowActive) => {
    const element = containerRef.value;
    if (isNowActive) {
      document.addEventListener('keydown', handleKeyDown);
      element?.addEventListener('click', handleClick);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      element?.removeEventListener('click', handleClick);
    }
  });

  // Uses parent component's lifecycle for listeners
  onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    handleFullscreenChange();
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    document.removeEventListener('keydown', handleKeyDown);
    containerRef.value?.removeEventListener('click', handleClick);

    // Attempt to exit fullscreen if component unmounts while active
    if (isFullscreenActive.value) {
      exit();
    }
  });

  return {
    isFullscreenActive: readonly(isFullscreenActive), // Returns read-only state
    enterFullscreen: enter,
    exitFullscreen: exit,
  };
}