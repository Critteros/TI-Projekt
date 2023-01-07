export const getCanvas = () => {
  const el = document.querySelector('div.canvas-wrapper > canvas');
  if (el === null) {
    throw new Error('Canvas element is not present on a page');
  }

  return el as HTMLCanvasElement;
};
