import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createKey } from "./interact.js";
import createEnemy from "./enemy.js";

const k = kaplay();

// optionnel : charge des ressources ou règle le root si besoin
k.loadRoot("./");

const player = createPlayer(k, 120, 80);
const enemy = createEnemy(k, 200, 400);
const key = createKey(k, 0, 0);
