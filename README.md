# Window
Window is my attempt at a Web Based Slideshow app. Comparable to PowerPoint or Google Slides.

## Getting Started

```
Installation
------------------
npm install

Run Locally
------------------
npm run dev
```

## Object Documentation

```
  Slide Object
  {
    id: String, // Unique ID for each slide - Date/Time.now -> iso timestamp
    elements: Object[] // Array of element objects
  }

  Element Object
  {
    id: String, // Unique ID for each element - Date/Time.now -> iso timestamp
    type: String // Text or Image
    content: String, //Markdown
    x: Number, // Coordinates
    y: Number,
    width: Number
    height: Number // Dimensions, height editable in image only. Text scales based on Content.
  }
```
