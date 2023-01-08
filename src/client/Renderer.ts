import Particle, { ParticleUpdate } from '@/client/Particle';
import { calculateDistance, k_combinations } from '@/client/utils/math';
import { MouseCollisionCircle, RendererSettings } from '@/client/types/rendering';

export default class Renderer {
  private particles: Particle[] = [];
  private options: RendererSettings;
  private mouse: MouseCollisionCircle | null;

  constructor(private canvasEl: OffscreenCanvas) {
    this.options = {
      particleCount: 0,
      particleSize: 0,
      lineWidth: 0,
      distance: 0,
    };
    this.mouse = {
      x: 0,
      y: 0,
      radius: 0,
    };
  }

  private createParticles(particleCount: number): Particle[] {
    const { width, height } = this.canvasEl;
    const { particleSize } = this.options;
    return Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * particleSize;
      const x = Math.random() * (width - size * 2 - size * 2) + size * 2;
      const y = Math.random() * (height - size * 2 - size * 2) + size * 2;
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

  /**
   * Clean whole canvas
   */
  public clearCanvas() {
    const ctx = this.ctx;
    const { width, height } = this.canvasEl;
    ctx.clearRect(0, 0, width, height);
  }

  /**
   * Context getter
   */
  public get ctx() {
    const ctx = this.canvasEl.getContext('2d');
    if (ctx === null) {
      throw new Error('Canvas context is null!');
    }
    return ctx as OffscreenCanvasRenderingContext2D;
  }

  /**
   * Used to update rendering params
   * @param update
   */
  public updateSettings(update: Partial<RendererSettings>) {
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

  public updateMouseCollider(collider: MouseCollisionCircle | null) {
    this.mouse = collider;
  }

  public updateDimensions({ width, height }: { width: number; height: number }) {
    if (this.canvasEl.width !== width || this.canvasEl.height !== height) {
      this.canvasEl.width = width;
      this.canvasEl.height = height;
    }
  }

  /**
   * Main draw function
   */
  public animate() {
    requestAnimationFrame(this.animate.bind(this));
    if (this.particles.length === 0) return;

    const ctx = this.ctx;
    const cursorLoc = this.mouse;
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
  public connectParticles(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    const combinations = k_combinations(this.particles, 2);
    const { height: canvasHeight, width: canvasWidth } = this.canvasEl;
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
