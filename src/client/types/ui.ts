export type SliderSettings = {
  initialValue: number;
  maxValue: number;
  minValue: number;
};
export type MenuOptions = {
  onParticleNumberChange: (newValue: number) => void;
  onParticleSizeChange: (newValue: number) => void;
  onDistanceChange: (newValue: number) => void;
  onLineThicknessChange: (newValue: number) => void;
  particleSliderSettings: SliderSettings;
  sizeSliderSettings: SliderSettings;
  distanceSliderSettings: SliderSettings;
  thicknessSliderSettings: SliderSettings;
};
