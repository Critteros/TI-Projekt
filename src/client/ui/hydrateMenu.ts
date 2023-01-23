import { getMenu, RangeUI } from '../selectors/landing';
import { convertRange, LinearRange } from '@/client/utils/math';
import { MenuOptions, SliderSettings } from '@/client/types/ui';
import { getDefaultMenuSettings } from '@/client/settings/defaults';
import { RendererSettings } from '@/client/types/rendering';

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
    ...getDefaultMenuSettings(),
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

  const getCurrentValues = (): RendererSettings => {
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
      lineWidth: thickness,
      distance: _distance,
      particleSize: _particleSize,
    };
  };

  const reset = () => {
    const {
      distanceSliderSettings,
      thicknessSliderSettings,
      sizeSliderSettings,
      particleSliderSettings,
    } = getDefaultMenuSettings();
    changeSliderValue(particleSliderSettings, particleCount);
    changeSliderValue(distanceSliderSettings, distance);
    changeSliderValue(thicknessSliderSettings, lineWidth);
    changeSliderValue(sizeSliderSettings, particleSize);
    {
      const { particleCount, lineWidth, distance, particleSize } = getCurrentValues();
      onParticleNumberChange(particleCount);
      onParticleSizeChange(particleSize);
      onLineThicknessChange(lineWidth);
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
