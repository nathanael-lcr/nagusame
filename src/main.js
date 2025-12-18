import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createKey } from "./interact.js";

const k = kaplay();

// optionnel : charge des ressources ou règle le root si besoin
k.loadRoot("./");


const player = createPlayer(k, 120, 80);
const key = createKey(k, 0, 0);

