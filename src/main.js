import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createKey } from "./interact.js";
import { createWalls } from "./walls.js";

const k = kaplay();

k.loadRoot("./");


k.scene("game", () => {
    const player = createPlayer(k, 120, 80);
    createKey(k, 0, 0);
    createWalls(k, -700, 250);

    k.onUpdate(() => {
        k.setCamPos(player.pos);
    })
});


k.go("game");