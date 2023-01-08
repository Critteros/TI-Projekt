import { k_combinations } from '@/client/utils/math';

export type CollisionCircle = {
  x: number;
  y: number;
  radius: number;
};

export default class CollisionDetector {
  private elements: CollisionCircle[] = [];

  public add(el: CollisionCircle) {
    this.elements.push(el);
  }

  public isColliding() {
    const combinations = k_combinations(this.elements, 2);

    return combinations
      .map((setOfTwo) => {
        const [firstEl, secondEl] = setOfTwo;
        return this.checkCollision(firstEl, secondEl);
      })
      .some((el) => el);
  }

  private checkCollision(first: CollisionCircle, second: CollisionCircle): boolean {
    const dx = first.x - second.x;
    const dy = first.y - second.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < first.radius + second.radius;
  }
}
