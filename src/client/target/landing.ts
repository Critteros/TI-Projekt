import '../css/landing.css';
import '@fontsource/roboto';

import { getCanvas } from '@/client/selectors/landing';
import { hydrateMenu } from '@/client/ui/hydrateMenu';
import WorkerRenderer from '@/client/WorkerRenderer';

// const renderer = new Renderer(getCanvas());
// renderer.animate();
const handle = new WorkerRenderer(getCanvas());

const { getCurrentValues } = hydrateMenu({
  onDistanceChange: (distance) => {
    handle.sendSettingsUpdate({ distance });
  },
  onLineThicknessChange: (lineWidth) => {
    handle.sendSettingsUpdate({ lineWidth });
  },
  onParticleSizeChange: (particleSize) => {
    handle.sendSettingsUpdate({ particleSize });
  },
  onParticleNumberChange: (particleCount) => {
    handle.sendSettingsUpdate({ particleCount });
  },
});
handle.sendSettingsUpdate(getCurrentValues());
handle.run();

export {};
