import '../css/landing.css';
import '@fontsource/roboto';

import Renderer from '@/client/Renderer';
import { getCanvas } from '@/client/selectors/landing';
import { hydrateMenu } from '@/client/ui/hydrateMenu';

const renderer = new Renderer(getCanvas());
renderer.animate();

const { getCurrentValues } = hydrateMenu({
  onDistanceChange: (distance) => {
    renderer.update({ distance });
  },
  onLineThicknessChange: (lineWidth) => {
    renderer.update({ lineWidth });
  },
  onParticleSizeChange: (particleSize) => {
    renderer.update({ particleSize });
  },
  onParticleNumberChange: (particleCount) => {
    renderer.update({ particleCount });
  },
});
renderer.update(getCurrentValues());

export {};
