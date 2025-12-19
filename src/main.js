// main.js
import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createWalls } from "./walls.js";
import { createKey, createDoor } from "./interact.js";
import createEnemy from "./enemy.js";
import createUI from "./UI.js";
import createWindow from "./window.js";

const k = kaplay();

k.loadRoot("./");

k.scene("level1", () => {
    const player = createPlayer(k, 120, 80);
    const key = createKey(k, 0, 0);
    const uiSquares = createUI(k, player);
    // const enemy = createEnemy(k, uiSquares, 0,-500);
    const door = createDoor(k, 180, 180); 
    createKey(k, 0, 0);
    createWalls(k, -700, 250,1800,200);
    createWalls(k,-700,-500,200,800);
    createWindow(k,-500,-250);
    k.onUpdate(() => {
        k.setCamPos(player.pos);
    })
});


k.go("level1");

