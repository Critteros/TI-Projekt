import IDrawable from '@/client/interfaces/IDrawable';
import CollisionDetector from '@/client/utils/CollisionDetector';

export type ParticleParams = {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
};

export type ParticleUpdate = {
  cursor: {
    x: number;
    y: number;
    radius: number;
  } | null;
  canvasWidth: number;
  canvasHeight: number;
};

export default class Particle implements IDrawable {
  public x: number;
  public y: number;
  private directionX: number;
  private directionY: number;
  public size: number;
  public color: string;

  constructor(params: ParticleParams) {
    this.x = params.x;
    this.y = params.y;
    this.directionX = params.directionX;
    this.directionY = params.directionY;
    this.size = params.size;
    this.color = params.color;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }

  public update({ cursor, canvasHeight, canvasWidth }: ParticleUpdate) {
    if (this.x > canvasWidth || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvasHeight || this.y < 0) {
      this.directionY = -this.directionY;
    }
    if (this.x > canvasWidth) {
      this.x = canvasWidth;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y > canvasHeight) {
      this.y = canvasHeight;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (cursor) {
      const collisionHandler = new CollisionDetector();
      collisionHandler.add({
        x: this.x,
        y: this.y,
        radius: this.size,
      });
      collisionHandler.add({
        ...cursor,
      });

      if (collisionHandler.isColliding()) {
        if (cursor.x < this.x && this.x < canvasWidth - this.size * 10) {
          this.x += 10;
          this.directionX = this.directionX > 0 ? this.directionX : -this.directionX;
        }
        if (cursor.x > this.x && this.x > this.size * 10) {
          this.x -= 10;
          this.directionX = this.directionX > 0 ? -this.directionX : this.directionX;
        }
        if (cursor.y < this.y && this.y < canvasHeight - this.size * 10) {
          this.y += 10;
          this.directionY = this.directionY > 0 ? this.directionY : -this.directionY;
        }
        if (cursor.y > this.y && this.y > this.size * 10) {
          this.y -= 10;
          this.directionY = this.directionY > 0 ? -this.directionY : this.directionY;
        }
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
  }
}
