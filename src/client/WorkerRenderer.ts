import { WorkerMessages } from '@/client/types/workerMessages';
import { MouseCollisionCircle, RendererSettings } from '@/client/types/rendering';

export default class WorkerRenderer {
  private worker: Worker;
  private mouseX = 0;
  private mouseY = 0;
  private mouseInside = false;

  constructor(private canvasEl: HTMLCanvasElement) {
    this.worker = new Worker('./bundle/renderingWorker.worker.js');

    canvasEl.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvasEl.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    canvasEl.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));

    this.resizeCanvas(true);

    const offscreenCanvas = canvasEl.transferControlToOffscreen();

    this.sendMessage(
      {
        type: 'init',
        canvas: offscreenCanvas,
      },
      [offscreenCanvas],
    );
  }

  public sendMessage(msg: WorkerMessages, transfer: Transferable[] = []) {
    this.worker.postMessage(msg, transfer);
  }

  public sendSettingsUpdate(newSettings: Partial<RendererSettings>) {
    this.sendMessage({
      type: 'updateSettings',
      settingsPartial: newSettings,
    });
  }

  public run() {
    this.sendMessage({
      type: 'start',
    });
  }

  private getMouseCollider(): MouseCollisionCircle | null {
    if (!this.mouseInside) return null;
    const { x, y } = this.canvasEl.getBoundingClientRect();
    const { width, height } = this.canvasEl;
    return {
      x: this.mouseX - x,
      y: this.mouseY - y,
      radius: 60,
    };
  }

  private updateMouseCollider() {
    const newCollider = this.getMouseCollider();
    this.sendMessage({
      type: 'updateMouseCollider',
      mouse: newCollider,
    });
  }

  private onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updateMouseCollider();
  }

  private onMouseLeave(event: MouseEvent) {
    this.mouseInside = false;
    this.updateMouseCollider();
  }

  private onMouseEnter(event: MouseEvent) {
    this.mouseInside = true;
    this.updateMouseCollider();
  }

  /**
   * Helper to handle canvas resize
   */
  public resizeCanvas(resizeSelf = false) {
    const { clientHeight, clientWidth } = this.canvasEl.parentElement as HTMLDivElement;
    if (resizeSelf) {
      this.canvasEl.width = clientWidth;
      this.canvasEl.height = clientHeight;
    }
    this.sendMessage({
      type: 'updateDimensions',
      width: clientWidth,
      height: clientHeight,
    });
  }

  private onResize() {
    this.resizeCanvas();
  }
}
