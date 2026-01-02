/**
 * Load an image from a File.
 * @param file - The image file to load.
 * @returns A promise that resolves to the loaded HTMLImageElement.
 */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
