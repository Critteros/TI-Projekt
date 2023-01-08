import { MenuOptions } from '@/client/types/ui';
import { RendererSettings } from '@/client/types/rendering';

export const getDefaultRenderingSettings = (): RendererSettings => {
  return {
    particleCount: 200,
    distance: 150,
    particleSize: 5,
    lineWidth: 1,
  };
};

export const getDefaultMenuSettings = (): MenuOptions => {
  const emptyFunction = () => {
    /**/
  };

  const { distance, particleSize, particleCount, lineWidth } = getDefaultRenderingSettings();

  return {
    onParticleNumberChange: emptyFunction,
    onParticleSizeChange: emptyFunction,
    onDistanceChange: emptyFunction,
    onLineThicknessChange: emptyFunction,
    particleSliderSettings: {
      maxValue: 800,
      minValue: 0,
      initialValue: particleCount,
    },
    distanceSliderSettings: {
      minValue: 0,
      maxValue: 1000,
      initialValue: distance,
    },
    sizeSliderSettings: {
      minValue: 0,
      maxValue: 10,
      initialValue: particleSize,
    },
    thicknessSliderSettings: {
      minValue: 0,
      maxValue: 20,
      initialValue: lineWidth,
    },
  };
};
