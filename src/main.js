// main.js

import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createWall } from "./walls.js";
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
    const enemy = createEnemy(k, uiSquares, 700,-500);
    const door = createDoor(k, 180, 180); 
    createWall(k, -700, 250,1800,200);
    createWall(k,-700,-500,200,800);
    createWindow(k,-500,-250,10,120,0);
    createWindow(k,-50,250,120,10,-Math.PI / 2);

    k.onUpdate(() => {
        k.setCamPos(player.pos);
    })
});


k.go("level1");

// Fenêtre qui regarde vers la droite (0°)
//  createWindows(k, 100, 200, 0);

// Fenêtre qui regarde vers la gauche (180°)
//  createWindows(k, 300, 200, Math.PI);

// Fenêtre qui regarde vers le haut (90°)
//  createWindows(k, 500, 200, -Math.PI / 2);

// Fenêtre qui regarde vers le bas (270°)
//  createWindows(k, 700, 200, Math.PI / 2);
