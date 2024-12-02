import * as PIXI from 'pixi.js';

export class MainHero {
    sprite: PIXI.Graphics;
    speed: number = 2;
    targetPosition: { x: number; y: number } | null = null;

    constructor(stage: PIXI.Container) {
        this.sprite = new PIXI.Graphics();
        this.sprite.circle(0, 0, 15);
        this.sprite.fill(0xff0000);
        this.sprite.position.set(100, 100);
        stage.addChild(this.sprite);
    }

    move(delta: number) {
        if (this.targetPosition) {
            const dx = this.targetPosition.x - this.sprite.x;
            const dy = this.targetPosition.y - this.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed * delta) {
                this.sprite.x += (dx / distance) * this.speed * delta;
                this.sprite.y += (dy / distance) * this.speed * delta;
            } else {
                this.targetPosition = null;
            }
        }
    }
}