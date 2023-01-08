import { MouseCollisionCircle, RendererSettings } from '@/client/types/rendering';

export type InitialMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
};

export type StartAnimation = {
  type: 'start';
};

export type UpdateSettings = {
  type: 'updateSettings';
  settingsPartial: Partial<RendererSettings>;
};

export type MouseColliderUpdate = {
  type: 'updateMouseCollider';
  mouse: MouseCollisionCircle | null;
};

export type UpdateDimensions = {
  type: 'updateDimensions';
  width: number;
  height: number;
};

export type WorkerMessages =
  | InitialMessage
  | StartAnimation
  | UpdateSettings
  | MouseColliderUpdate
  | UpdateDimensions;

export type WorkerMessageTypes = WorkerMessages['type'];
