import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createKey } from "./interact.js";
import createEnemy from "./enemy.js";
import createUI from "./UI.js";

const k = kaplay();

// optionnel : charge des ressources ou règle le root si besoin
k.loadRoot("./");

const player = createPlayer(k, 120, 80);
const key = createKey(k, 0, 0);
const uiSquares = createUI(k, player);
const enemy = createEnemy(k, uiSquares, 200, 400);
