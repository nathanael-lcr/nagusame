import kaplay from "kaplay";

const k = kaplay();

// optionnel : charge des ressources ou règle le root si besoin
k.loadRoot("./");

import createPlayer from "./player.js";
import createEnemy from "./enemy.js";

const player = createPlayer(k, 120, 80);
const enemy = createEnemy(k, 200, 400);