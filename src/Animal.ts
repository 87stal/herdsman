import * as PIXI from 'pixi.js';

export class Animal {
    sprite: PIXI.Graphics;
    isFollowing: boolean = false;
    patrolPoints: { x: number; y: number }[]; // Патрульні точки
    currentPatrolIndex: number = 0; // Поточна точка патруля
    speed: number = 1; // Швидкість руху

    constructor(stage: PIXI.Container, x: number, y: number) {
        this.sprite = new PIXI.Graphics();
        this.sprite.circle(0, 0, 10);
        this.sprite.fill(0xffffff);
        this.sprite.position.set(x, y);
        stage.addChild(this.sprite);

        // Randomly generate patrol points
        this.patrolPoints = [
            { x: x + Math.random() * 100 - 50, y: y + Math.random() * 100 - 50 },
            { x: x + Math.random() * 100 - 50, y: y + Math.random() * 100 - 50 },
        ];
    }

    patrol(delta: number, yardBounds: PIXI.Bounds) {
        // If the animal follows the player, stop patrolling
        if (this.isFollowing) return;

        const target = this.patrolPoints[this.currentPatrolIndex];
        const dx = target.x - this.sprite.x;
        const dy = target.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
            // We move to the current patrol point
            const nextX = this.sprite.x + (dx / distance) * this.speed * delta;
            const nextY = this.sprite.y + (dy / distance) * this.speed * delta;
            // Prevent the animal from entering the yard
            if (!yardBounds.containsPoint(nextX, nextY)) {
                this.sprite.x = nextX;
                this.sprite.y = nextY;
            } else {
                // Skip this patrol point and choose another
                this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            }
        } else {
            // Switch to the next patrol point
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        }
    }

    follow(target: PIXI.Graphics, delta: number) {
        const dx = target.x - this.sprite.x;
        const dy = target.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            this.sprite.x += (dx / distance) * 1.5 * delta;
            this.sprite.y += (dy / distance) * 1.5 * delta;
        }
    }
}