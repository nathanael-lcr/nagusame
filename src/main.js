import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createWalls } from "./walls.js";
import { createKey, createDoor } from "./interact.js";
import createEnemy from "./enemy.js";
import createUI from "./UI.js";

const k = kaplay();
k.loadRoot("./");

k.scene("game", () => {
    const player = createPlayer(k, 120, 80);
    createKey(k, 0, 0);
    
    const uiSquares = createUI(k, player);

    createEnemy(k, uiSquares, 200, 400);

    createDoor(k, 180, 180);
    createWalls(k, -700, 250);

    k.onUpdate(() => {
        k.setCamPos(player.pos);
    });
});

k.go("game");