export const getCanvas = () => {
  const el = document.querySelector('div.canvas-wrapper > canvas');
  if (el === null) {
    throw new Error('Canvas element is not present on a page');
  }

  return el as HTMLCanvasElement;
};

export type RangeUI = {
  label: HTMLLabelElement;
  display: HTMLSpanElement;
  slider: HTMLInputElement;
};

export const getMenu = () => {
  const getRangeUI = (idBase: string): RangeUI => {
    const label = document.querySelector(`label[for=${idBase}_slider]`);
    const valueDisplay = document.querySelector(`span#${idBase}_slider_value`);
    const slider = document.querySelector(`input[type="range"]#${idBase}_slider`);

    if (label === null) {
      throw new Error(`Unable to find label for idBase=${idBase}`);
    }
    if (valueDisplay === null) {
      throw new Error(`Unable to find span for idBase=${idBase}`);
    }

    if (slider === null) {
      throw new Error(`Unable to find slide for idBase=${idBase}`);
    }

    return {
      label: label as HTMLLabelElement,
      display: valueDisplay as HTMLSpanElement,
      slider: slider as HTMLInputElement,
    };
  };

  return {
    particleCount: getRangeUI('particle_count'),
    particleSize: getRangeUI('size'),
    distance: getRangeUI('distance'),
    lineWidth: getRangeUI('line'),
  };
};
