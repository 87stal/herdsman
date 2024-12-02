import * as PIXI from 'pixi.js';
import { MainHero } from './MainHero';
import { Animal } from './Animal';
import { Yard } from './Yard';

export class Game {
    app: PIXI.Application;
    mainHero: MainHero;
    animals: Animal[] = [];
    yard: Yard;
    score: number = 0;
    scoreText: PIXI.Text;
    group: Animal[] = []; // Track animals in the group (max 5)

    constructor(app: PIXI.Application) {
        this.app = app;


        const stage = this.app.stage;
        this.yard = new Yard(stage);
        this.mainHero = new MainHero(stage);
        // Spawn initial animals
        // Generate a random number of animals (e.g., between 5 and 15)
        const numAnimals = Math.floor(Math.random() * 11) + 5; // Random number between 5 and 15
        for (let i = 0; i < numAnimals; i++) {
            this.spawnAnimal(); // Spawn each animal at a random position
        }

        // Add the score display
        this.scoreText = new PIXI.Text(`Score: ${this.score}`, {
            fontSize: 24,
            fill: 0xffffff,
            fontFamily: 'Arial',
        });
        this.scoreText.position.set(10, 10); // Top-left corner
        stage.addChild(this.scoreText);

        // Handle player click
        this.app.canvas.addEventListener("click", (e) => {
            const rect = this.app.canvas.getBoundingClientRect();
            this.mainHero.targetPosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        });

        // Start spawning animals
        this.startAnimalSpawner();

        // Add game loop
        this.app.ticker.add((delta) => this.gameLoop(delta.deltaTime));
    }

    private spawnAnimal(): void {
        let x: number, y: number;

        // Generate random positions until the animal is outside the yard
        do {
            x = Math.random() * (this.app.screen.width - 50) + 25;
            y = Math.random() * (this.app.screen.height - 50) + 25;
        } while (this.isInYard(x, y)); // Ensure the animal is not in the yard

        const newAnimal = new Animal(this.app.stage, x, y);
        this.animals.push(newAnimal);
    }

// Helper function to check if a position is inside the yard
    isInYard(x: number, y: number): boolean {
        const yardBounds = this.yard.sprite.getBounds(); // Get the yard bounds
        return yardBounds.containsPoint(x, y); // Returns true if the position is in the yard
    }

    gameLoop(delta: number) {
        this.mainHero.move(delta);

        const yardBounds = this.yard.sprite.getBounds(); // Get the yard bounds
        // Check for collisions
        this.animals.forEach((animal, index) => {
                const dx = animal.sprite.x - this.mainHero.sprite.x;
                const dy = animal.sprite.y - this.mainHero.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (!animal.isFollowing && distance < 30 && this.group.length < 5) {
                    animal.isFollowing = true; // Animal starts following
                    this.group.push(animal); // Add to group
                }

            if (animal.isFollowing) {
                animal.follow(this.mainHero.sprite, delta);
            } else {
                animal.patrol(delta, yardBounds); // If the animal is not following, it patrols
            }
        });

        // Check if any animals reached the yard
        this.group.forEach((animal, index) => {
            if (this.yard.checkAnimalCollision(animal)) {
                this.score++;
                this.updateScore();
                animal.sprite.destroy();
                this.group.splice(index, 1); // Remove animal from group
                const animalIndex = this.animals.indexOf(animal);
                if (animalIndex !== -1) {
                    this.animals.splice(animalIndex, 1);
                }
            }
        });
    }

    private startAnimalSpawner(): void {
        const maxAnimals = 20; // Maximum number of animals allowed
        const spawnInterval = () => Math.random() * 3000 + 2000;

        const spawner = () => {
            if (this.animals.length < maxAnimals) {
                this.spawnAnimal();
            }
            setTimeout(spawner, spawnInterval());
        };

        spawner();
    }
    private updateScore() {
        this.scoreText.text = `Score: ${this.score}`; // Update the score text
    }
}