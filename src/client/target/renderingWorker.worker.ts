import Renderer from '@/client/Renderer';
import { WorkerMessages } from '@/client/types/workerMessages';

let renderer: Renderer | null = null;

self.onmessage = (evt: MessageEvent<WorkerMessages>) => {
  const appEvent = evt.data;
  switch (appEvent.type) {
    case 'init': {
      renderer = new Renderer(appEvent.canvas);
      break;
    }
    case 'updateSettings': {
      renderer?.updateSettings(appEvent.settingsPartial);
      break;
    }
    case 'start': {
      renderer?.animate();
      break;
    }
    case 'updateMouseCollider': {
      renderer?.updateMouseCollider(appEvent.mouse);
      break;
    }
    case 'updateDimensions': {
      renderer?.updateDimensions({ ...appEvent });
      break;
    }
  }
};

export {};
