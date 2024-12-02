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
        const minAnimals = 5; // Minimum number of animals
        const maxAnimals = 15; // Maximum number of animals
        this.yard = new Yard(stage);
        this.mainHero = new MainHero(stage);
        
        // Spawn initial animals
        // Generate a random number of animals (e.g., between 5 and 15)
        const numAnimals = Math.floor(Math.random() * (maxAnimals - minAnimals + 1)) + minAnimals; // Random number between 5 and 15
        for (let i = 0; i < numAnimals; i++) {
            this.spawnAnimal(); // Spawn each animal at a random position
        }

        // Add the score display
        this.scoreText = new PIXI.Text({
            text: `Score: ${this.score}`,
            fontSize: 24,
            fill: 0xffffff,
            fontFamily: 'Arial',
        } as PIXI.TextOptions);
        
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
        const spawnMargin = 50; // Margin from the screen edges for animal spawn
        const spawnPadding = 25; // Additional padding to keep animals away from the exact edges

        // Generate random positions until the animal is outside the yard
        do {
            x = Math.random() * (this.app.screen.width - spawnMargin) + spawnPadding;
            y = Math.random() * (this.app.screen.height - spawnMargin) + spawnPadding;
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
            const followDistance = 30; // Maximum distance for an animal to start following
            const maxGroupSize = 5;   // Maximum number of animals in the group

                if (!animal.isFollowing && distance < followDistance && this.group.length < maxGroupSize) {
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
        const minSpawnInterval = 2000; // Minimum time between spawns (ms)
        const maxAdditionalInterval = 3000; // Random additional time added to the spawn interval

        const spawnInterval = () => Math.random() * maxAdditionalInterval + minSpawnInterval;

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