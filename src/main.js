// main.js
import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createKey, createDoor } from "./interact.js"; // On importe createDoor
import createEnemy from "./enemy.js";

const k = kaplay();

k.loadRoot("./");

const player = createPlayer(k, 120, 80);
const enemy = createEnemy(k, 200, 400);
const key = createKey(k, 0, 0);
// On ajoute la porte à une position spécifique
const door = createDoor(k, 180, 180); 