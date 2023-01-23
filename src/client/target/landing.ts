import '../css/landing.css';

import { getCanvas } from '@/client/selectors/landing';
import { hydrateMenu } from '@/client/ui/hydrateMenu';
import WorkerRenderer from '@/client/WorkerRenderer';
import { api } from '@/client/api';
import { DataManager } from '@/client/DataManager';

const handle = new WorkerRenderer(getCanvas());
const dataManager = new DataManager();

(async () => {
  const { getCurrentValues } = hydrateMenu({
    ...(await dataManager.initialValues()),
    onDistanceChange: (distance) => {
      dataManager.change({ distance });
      handle.sendSettingsUpdate({ distance });
    },
    onLineThicknessChange: (lineWidth) => {
      dataManager.change({ lineWidth });
      handle.sendSettingsUpdate({ lineWidth });
    },
    onParticleSizeChange: (particleSize) => {
      dataManager.change({ particleSize });
      handle.sendSettingsUpdate({ particleSize });
    },
    onParticleNumberChange: (particleCount) => {
      dataManager.change({ particleCount });
      handle.sendSettingsUpdate({ particleCount });
    },
  });
  handle.sendSettingsUpdate(getCurrentValues());
  handle.run();
})();

document.querySelector('button.btn-logout')?.addEventListener('click', async (event) => {
  event.preventDefault();

  try {
    await api.public.post('/api/auth/logout');
  } catch (e) {
    console.error(e);
  }
  window.location.replace('/');
});

export {};
