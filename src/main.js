import kaplay from "kaplay";

const k = kaplay();

// optionnel : charge des ressources ou règle le root si besoin
k.loadRoot("./");

import createPlayer from "./player.js";

const player = createPlayer(k, 120, 80);
