import Particle, { ParticleUpdate } from '@/client/Particle';
import { k_combinations, calculateDistance } from '@/client/utils/math';

export type RendererOptions = {
  particleCount: number;
  particleSize: number;
  distance: number;
  lineWidth: number;
};

export default class Renderer {
  private mouseInside = false;
  private mouseX = 0;
  private mouseY = 0;
  private particles: Particle[];
  private options: RendererOptions;

  constructor(private canvasEl: HTMLCanvasElement, options: Partial<RendererOptions> = {}) {
    canvasEl.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvasEl.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    canvasEl.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));

    this.options = {
      particleCount: options.particleCount ?? 100,
      distance: options.particleCount ?? 150,
      particleSize: options.particleSize ?? 5,
      lineWidth: options.lineWidth ?? 1,
    };

    this.resizeCanvas();

    this.particles = this.createParticles(this.options.particleCount);
  }

  private createParticles(particleCount: number): Particle[] {
    const { clientWidth, clientHeight } = this.canvasEl;
    const { particleSize } = this.options;
    return Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * particleSize;
      const x = Math.random() * (clientWidth - size * 2 - size * 2) + size * 2;
      const y = Math.random() * (clientHeight - size * 2 - size * 2) + size * 2;
      const directionX = Math.random() * 5 - 2.5;
      const directionY = Math.random() * 5 - 2.5;
      const color = 'white';

      return new Particle({
        x,
        directionY,
        directionX,
        y,
        color,
        size,
      });
    });
  }

  private onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private onMouseLeave(event: MouseEvent) {
    this.mouseInside = false;
  }

  private onMouseEnter(event: MouseEvent) {
    this.mouseInside = true;
  }

  private onResize() {
    this.resizeCanvas();
  }

  public getMouseLoc() {
    if (!this.mouseInside) return null;
    const { x, y } = this.canvasEl.getBoundingClientRect();
    const { width, height } = this.canvasEl;
    return {
      x: this.mouseX - x,
      y: this.mouseY - y,
      radius: 60,
    };
  }

  /**
   * Clean whole canvas
   */
  public clearCanvas() {
    const ctx = this.ctx;
    const { width, height } = this.canvasEl;
    ctx.clearRect(0, 0, width, height);
  }

  /**
   * Helper to handle canvas resize
   */
  public resizeCanvas() {
    const { clientHeight, clientWidth, width, height } = this.canvasEl;
    if (clientWidth !== width || clientHeight !== height) {
      this.canvasEl.width = clientWidth;
      this.canvasEl.height = clientHeight;
    }
  }

  /**
   * Context getter
   */
  public get ctx() {
    const ctx = this.canvasEl.getContext('2d');
    if (ctx === null) {
      throw new Error('Canvas context is null!');
    }
    return ctx;
  }

  /**
   * Used to update rendering params
   * @param update
   */
  public update(update: Partial<RendererOptions>) {
    const newOptions = {
      ...this.options,
      ...update,
    };
    const oldOptions = this.options;

    const {
      particleCount: newParticleCount,
      particleSize: newParticleSize,
      distance: newDistance,
      lineWidth: newLineWidth,
    } = newOptions;

    const {
      particleCount: oldParticleCount,
      particleSize: oldParticleSize,
      distance: oldDistance,
      lineWidth: oldLineWidth,
    } = oldOptions;

    this.options = newOptions;

    if (newParticleCount < oldParticleCount) {
      // Delete particles
      this.particles = this.particles.slice(oldParticleCount - newParticleCount);
    } else {
      // Add extra particles
      this.particles = [
        ...this.particles,
        ...this.createParticles(newParticleCount - oldParticleCount),
      ];
    }

    if (newParticleSize !== oldParticleSize) {
      this.particles.forEach((particle) => {
        particle.size = newParticleSize;
      });
    }
  }

  /**
   * Main draw function
   */
  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    const ctx = this.ctx;
    const cursorLoc = this.getMouseLoc();
    const { width: canvasWidth, height: canvasHeight } = this.canvasEl;
    this.clearCanvas();

    const updateParam: ParticleUpdate = {
      cursor: cursorLoc,
      canvasHeight,
      canvasWidth,
    };

    this.particles.forEach((particle) => {
      particle.update(updateParam);
      particle.draw(ctx);
    });

    this.connectParticles(ctx);
  }

  /**
   * Draw lines between particles
   * @param ctx
   */
  public connectParticles(ctx: CanvasRenderingContext2D) {
    const combinations = k_combinations(this.particles, 2);
    const { clientHeight: canvasHeight, clientWidth: canvasWidth } = this.canvasEl;
    const { distance: threshold, lineWidth } = this.options;

    const drawLine = (first: Particle, second: Particle, alpha: number) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = lineWidth * alpha;
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
      ctx.closePath();
      ctx.stroke();
    };

    combinations.forEach(([first, second]) => {
      if (lineWidth !== 0) {
        const distance = calculateDistance(first, second);
        if (distance < threshold) {
          drawLine(first, second, 1 - distance / threshold);
        }
      }
    });
  }
}
