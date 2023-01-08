import { getMenu, RangeUI } from '../selectors/landing';
import { LinearRange, convertRange } from '@/client/utils/math';

type SliderSettings = {
  initialValue: number;
  maxValue: number;
  minValue: number;
};

type MenuOptions = {
  onParticleNumberChange: (newValue: number) => void;
  onParticleSizeChange: (newValue: number) => void;
  onDistanceChange: (newValue: number) => void;
  onLineThicknessChange: (newValue: number) => void;
  particleSliderSettings: SliderSettings;
  sizeSliderSettings: SliderSettings;
  distanceSliderSettings: SliderSettings;
  thicknessSliderSettings: SliderSettings;
};

const getDefaultOptions = (): MenuOptions => {
  const emptyFunction = () => {
    /**/
  };

  return {
    onParticleNumberChange: emptyFunction,
    onParticleSizeChange: emptyFunction,
    onDistanceChange: emptyFunction,
    onLineThicknessChange: emptyFunction,
    particleSliderSettings: {
      maxValue: 800,
      minValue: 0,
      initialValue: 100,
    },
    distanceSliderSettings: {
      minValue: 0,
      maxValue: 1000,
      initialValue: 150,
    },
    sizeSliderSettings: {
      minValue: 0,
      maxValue: 10,
      initialValue: 5,
    },
    thicknessSliderSettings: {
      minValue: 0,
      maxValue: 20,
      initialValue: 1,
    },
  };
};

const toSliderRange = (value: number, range: LinearRange) => {
  const sliderRange: LinearRange = {
    min: 0,
    max: 100,
  };
  return convertRange(value, range, sliderRange);
};

const fromSliderRange = (value: number, range: LinearRange) => {
  const sliderRange: LinearRange = {
    min: 0,
    max: 100,
  };
  return convertRange(value, sliderRange, range);
};

export const hydrateMenu = (options: Partial<MenuOptions> = {}) => {
  const { lineWidth, particleCount, particleSize, distance, resetBtn } = getMenu();
  const settings: MenuOptions = {
    ...getDefaultOptions(),
    ...options,
  };
  const {
    particleSliderSettings,
    distanceSliderSettings,
    thicknessSliderSettings,
    sizeSliderSettings,
    onParticleSizeChange,
    onParticleNumberChange,
    onDistanceChange,
    onLineThicknessChange,
  } = settings;

  const changeSliderValue = (settings: SliderSettings, target: RangeUI, value?: number) => {
    const { minValue: min, initialValue, maxValue: max } = settings;
    const { slider, display } = target;
    const targetValue = value ?? initialValue;
    const normalised = toSliderRange(targetValue, {
      max,
      min,
    });
    slider.value = `${normalised}`;
    display.innerText = `${targetValue}`;
  };
  // Initial sizes
  changeSliderValue(particleSliderSettings, particleCount);
  changeSliderValue(distanceSliderSettings, distance);
  changeSliderValue(thicknessSliderSettings, lineWidth);
  changeSliderValue(sizeSliderSettings, particleSize);

  // Change listeners
  particleCount.slider.addEventListener('change', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = particleSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    onParticleNumberChange(value);
  });
  particleCount.slider.addEventListener('input', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = particleSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    particleCount.display.innerText = `${value}`;
  });

  particleSize.slider.addEventListener('change', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = sizeSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    onParticleSizeChange(value);
  });
  particleSize.slider.addEventListener('input', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = sizeSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    particleSize.display.innerText = `${value}`;
  });

  distance.slider.addEventListener('change', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = distanceSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    onDistanceChange(value);
  });
  distance.slider.addEventListener('input', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = distanceSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    distance.display.innerText = `${value}`;
  });

  lineWidth.slider.addEventListener('change', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = thicknessSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    onLineThicknessChange(value);
  });
  lineWidth.slider.addEventListener('input', (event) => {
    const inputEl = event.target as HTMLInputElement;
    const { minValue: min, maxValue: max } = thicknessSliderSettings;
    const value = fromSliderRange(parseInt(inputEl.value), { min, max });
    lineWidth.display.innerText = `${value}`;
  });

  const getCurrentValues = () => {
    const particleRaw = particleCount.display.innerText;
    const sizeRaw = particleSize.display.innerText;
    const distanceRaw = distance.display.innerText;
    const thicknessRaw = lineWidth.display.innerText;

    const _particleCount = parseInt(particleRaw);
    const _particleSize = parseInt(sizeRaw);
    const _distance = parseInt(distanceRaw);
    const thickness = parseInt(thicknessRaw);

    return {
      particleCount: _particleCount,
      thickness,
      distance: _distance,
      particleSize: _particleSize,
    };
  };

  const reset = () => {
    changeSliderValue(particleSliderSettings, particleCount);
    changeSliderValue(distanceSliderSettings, distance);
    changeSliderValue(thicknessSliderSettings, lineWidth);
    changeSliderValue(sizeSliderSettings, particleSize);
    {
      const { particleCount, thickness, distance, particleSize } = getCurrentValues();
      onParticleNumberChange(particleCount);
      onParticleSizeChange(particleSize);
      onLineThicknessChange(thickness);
      onDistanceChange(distance);
    }
  };

  resetBtn.addEventListener('click', () => {
    reset();
  });

  return {
    getCurrentValues,
  };
};
