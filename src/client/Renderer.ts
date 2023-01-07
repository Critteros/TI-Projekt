import Particle, { ParticleUpdate } from 'src/Particle';
import { k_combinations, calculateDistance } from '@/client/utils/math';

export type RendererOptions = {
  particleCount: number;
  threshold: number;
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
      threshold: options.particleCount ?? 150,
    };

    this.resizeCanvas();

    this.particles = this.createParticles(this.options.particleCount);
  }

  private createParticles(particleCount: number): Particle[] {
    const { clientWidth, clientHeight } = this.canvasEl;
    return Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * 5 + 1;
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
    this.update();
  }

  private onMouseLeave(event: MouseEvent) {
    this.mouseInside = false;
    this.update();
  }

  private onMouseEnter(event: MouseEvent) {
    this.mouseInside = true;
    this.update();
  }

  private onResize() {
    this.resizeCanvas();
    this.update();
  }

  public getMouseLoc() {
    if (!this.mouseInside) return null;
    const { x, y } = this.canvasEl.getBoundingClientRect();
    const { width, height } = this.canvasEl;
    return {
      x: this.mouseX - x,
      y: this.mouseY - y,
      radius: (height / 100) * (width / 80),
    };
  }

  public clearCanvas() {
    const ctx = this.ctx;
    const { width, height } = this.canvasEl;
    ctx?.clearRect(0, 0, width, height);
  }

  public resizeCanvas() {
    console.log('resize!');
    const { clientHeight, clientWidth, width, height } = this.canvasEl;
    if (clientWidth !== width || clientHeight !== height) {
      this.canvasEl.width = clientWidth;
      this.canvasEl.height = clientHeight;
    }
  }

  public get ctx() {
    const ctx = this.canvasEl.getContext('2d');
    if (ctx === null) {
      throw new Error('Canvas context is null!');
    }
    return ctx;
  }

  private update() {
    // this.clearCanvas();
    // const ctx = this.ctx;
    //
    // const pos = this.getMouseLoc();
    //
    // const particle = new Particle({
    //   x: 100,
    //   y: 100,
    //   size: 50,
    //   color: 'white',
    //   directionY: 100,
    //   directionX: 100,
    // });
    // particle.draw(ctx);
    //
    // if (pos) {
    //   const { x, y } = pos;
    //   ctx.beginPath();
    //   ctx.fillStyle = 'white';
    //   // console.log(x, y);
    //   ctx.arc(x, y, 20, 0, 2 * Math.PI);
    //   ctx.fill();
    //   ctx.closePath();
    // }
  }

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

  public connectParticles(ctx: CanvasRenderingContext2D) {
    const combinations = k_combinations(this.particles, 2);
    const { clientHeight: canvasHeight, clientWidth: canvasWidth } = this.canvasEl;
    const { threshold } = this.options;

    const drawLine = (first: Particle, second: Particle, alpha: number) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = alpha;
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
      ctx.closePath();
      ctx.stroke();
    };

    combinations.forEach(([first, second]) => {
      const distance = calculateDistance(first, second);
      if (distance < threshold) {
        drawLine(first, second, 1 - distance / threshold);
      }
    });
  }
}
