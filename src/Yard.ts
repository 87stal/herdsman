import * as PIXI from 'pixi.js';
import {Animal} from "./Animal";

export class Yard {
    sprite: PIXI.Graphics;

    constructor(stage: PIXI.Container) {
        this.sprite = new PIXI.Graphics();
        this.sprite.rect(0, 0, 100, 100);
        this.sprite.fill(0xffff00);
        this.sprite.position.set(400, 300);
        stage.addChild(this.sprite);
    }

    checkAnimalCollision(animal: Animal): boolean {
        const yardBounds = this.sprite.getBounds(); 
        const animalBounds = animal.sprite.getBounds(); 

        // Check if the animal's center is inside the yard bounds
        return yardBounds.containsPoint(
            animalBounds.x + animalBounds.width / 2,
            animalBounds.y + animalBounds.height / 2
        );
    }
}