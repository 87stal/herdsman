import * as PIXI from 'pixi.js';
import { Game } from './Game';

const appWidth: number = window.innerWidth;
const appHeight: number = window.innerHeight;

// Create a new application
(async () => {

    // Create a new application
    const app = new PIXI.Application();
    
    // Initialize the application
    await app.init({ background: '0x00ff00', width: appWidth, height: appHeight });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas); 

    new Game(app);

})()
   