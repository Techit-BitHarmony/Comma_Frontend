/**
 * Generate responsive image set (srcset) data
 * Doc: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#how_do_you_create_responsive_images
 */
export function generateSrcset(image) {
  if (image) {
    return image.map(function(img) {
      return img && img.width ? img.url + " " + img.width + "w" : img.url;
    }).join(",");
  }
}

// Convert milliseconds to date and trim (simple way)
export function convertMilliseconds(ms) {
  return new Date(ms).toISOString().slice(14, 19);
}

// Get year from date
export function transformDate(date) {
  let d = new Date(date);
  return {
    year: d.getFullYear()
  };
};

export function errorHandler(form, key) {
  return form && form.error && form.errors[key];
}

export function removeEmptyElements(items) {
  return items.filter(function(n) { return n; });
}
