import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
//Manages the current slideshow
//Have methods for editing / creating new slides in a presentation
//Have method for loading in a 'save file' of an existing presentation

export const usePresentationStore = defineStore("presentation", () => {
  /**
   * @type {Object}
   * @property {string} title - The Name of the Presentation
   * @property {Object[]} slides - Array of slide objects
   */
  const slides = ref([
    {
      id: "1",
      elements: [
        {
          id: "1",
          type: "text",
          content: "# Slide 1",
          x: 50,
          y: 50,
          width: 300,
          height: 100,
        },
        {
          id: "2",
          type: "image",
          src: "https://placehold.co/600x400",
          x: 400,
          y: 200,
          width: 300,
          height: 150,
        },
      ],
    },
    {
      id: "2",
      elements: [
        {
          id: "1",
          type: "text",
          content: "# Slide 2",
          x: 50,
          y: 50,
          width: 300,
          height: 100,
        },
        {
          id: "2",
          type: "image",
          src: "https://placehold.co/600x400",
          x: 400,
          y: 200,
          width: 300,
          height: 150,
        },
      ],
    },
  ]);

  const currentSlideId = ref("1");
  // For Presentation Mode 
  // const currentSlideIndex = ref(0);
  const currentSlideIndex = computed(() => {
    return slides.value.findIndex((s) => s.id === currentSlideId.value);

  })

  const totalSlides = computed(() => slides.value.length);

  /**
   * Slide Getters
   */

  // Gets the actual Slide Object for currentSlideId
  const currentSlide = computed(() => {
    return (
      slides.value.find((slide) => slide.id === currentSlideId.value) || null
    );
  });

  // Gets the elements of the current slide
  const currentSlideElements = computed(() => {
    return currentSlide.value ? currentSlide.value.elements : [];
  });

  /**
   * Element Methods
   */

  function addElement(elementType) {
    const slide = currentSlide.value; // Get current slide object
    if (!slide) {
      console.error("Cannot add element: No current slide selected.");
      return null; // Or throw error
    }

    // Serves as ID
    const date = new Date();

    const newElement = {
      id: date.toISOString(),
      type: elementType,
      x: 50,
      y: 40,
      width: elementType === "text" ? 200 : 150,
      height: elementType === "text" ? 50 : 150,
      ...(elementType === "text" && { content: "New Text" }),
      ...(elementType === "image" && { src: "https://placehold.co/600x400" }),
    };

    slide.elements.push(newElement);

    return newElement.id; // Return ID for selection
  }

  function updateElement(updatePayload) {
    const slide = currentSlide.value;
    if (!slide) return;

    const elementIndex = slide.elements.findIndex(
      (el) => el.id === updatePayload.id
    );
    if (elementIndex !== -1) {
      const payload = { ...updatePayload };
      if (payload.x !== undefined) payload.x = Math.round(payload.x);
      if (payload.y !== undefined) payload.y = Math.round(payload.y);

      // Assign Values
      slide.elements[elementIndex] = {
        ...slide.elements[elementIndex],
        ...payload,
      };
    } else {
      console.warn(
        `Element with ID ${updatePayload.id} not found on current slide.`
      );
    }
  }

  function deleteElement(elementId) {
    const slide = currentSlide.value;

    const initialLength = slide.elements.length;

    slide.elements = slide.elements.filter((el) => el.id !== elementId);

    if (slide.elements.length === initialLength) {
      console.warn(`Element with ID ${elementId} not found for deletion.`);
    }
  }

  /**
   * Slide Methods
   */
  /**
   * @description Adds a new slide and makes it the 'current slide'
   */
  function addSlide() {
    const date = new Date();
    const newSlide = { id: date.toISOString(), elements: [] };
    slides.value.push(newSlide);
    currentSlideId.value = newSlide.id; // Switch to new slide
  }

  // Deletes a slide by ID - TODO: Expand on delete UI
  function deleteSlide(slideId = currentSlideId.value) {
    const slideIndex = slides.value.findIndex((s) => s.id === slideId);

    // Remove Slide from data
    slides.value = slides.value.slice(0, slideIndex);

    currentSlideId.value = null;
  }

  function savePresentation(fileName) {
    try {
      const jsonString = JSON.stringify(slides.value, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      /// Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saving presentation:", error);
      alert("Error saving presentation");
    }
  }

  function loadPresentation(file) {
    // File has been verified by this step
    // TODO: Consider Extra Validation here, presentation array, slide object, and element objects(.every()).
    currentSlideId.value = null;
    slides.value = structuredClone(file);
    currentSlideId.value = slides.value[0].id
  }


  /**
   * Presentation Methods
   */

  function nextSlide() {
    console.log('hit methods')
    if (currentSlideIndex.value < totalSlides.value - 1) {
      // currentSlideIndex.value++;
      currentSlideId.value = slides.value[currentSlideIndex.value + 1].id;
    }
  }

  function previousSlide() {
    console.log('hit methods')
    console.log(currentSlideIndex.value)
    if (currentSlideIndex.value > 0) {
      console.log('inside if')
      currentSlideId.value = slides.value[currentSlideIndex.value - 1].id;
    }
  }

  

  const progressText = computed(() => {
    if (totalSlides.value === 0) return '0 / 0';
    return `${currentSlideIndex.value + 1} / ${totalSlides.value}`;
  });

  return {
    addSlide,
    currentSlide,
    currentSlideElements,
    currentSlideId,
    currentSlideIndex,
    addElement,
    updateElement,
    deleteElement,
    slides,
    deleteSlide,
    savePresentation,
    loadPresentation,
    nextSlide,
    previousSlide,
    progressText,
  };
});
