import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createWall } from "./walls.js";
import { createKey, createDoor } from "./interact.js";
import createEnemy from "./enemy.js";
import createLighting from "./lighting.js";
import createUI from "./UI.js";
import createWindow from "./window.js";

const k = kaplay();
k.loadRoot("./");

// Crée un layer pour l'UI
k.setLayers([
  "game",  // tout ce qui est jeu normal
  "ui",    // UI
], "game"); // couche par défaut = game


// main.js - Shader avec pixels parfaitement carrés
k.loadShader(
  "playerLight",
  null,
  `
uniform float u_player_x;
uniform float u_player_y;
uniform float u_radius;
uniform float u_softness;
uniform float u_aspect;
uniform float u_time;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec4 c = def_frag();

    if (uv.x > 0.9 && uv.y > 0.9) { // zone UI
        return def_frag(); // ne pas appliquer le shader
    }

    // Corriger l'aspect ratio dès le départ
    vec2 corrected_uv = vec2(uv.x * u_aspect, uv.y);
    vec2 corrected_player = vec2(u_player_x * u_aspect, u_player_y);

    // Pixeliser dans l'espace corrigé
    float pixelSize = 0.015;
    vec2 pixelated_uv = floor(corrected_uv / pixelSize) * pixelSize + pixelSize * 0.5;

    // Distance au joueur
    float dist = distance(pixelated_uv, corrected_player);

    // Bruit animé par pixel
    float noise = fract(sin(dot(pixelated_uv, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
    float jitter = (noise - 0.5) * 0.08;

    // Calcul de la lumière
    float light = smoothstep(u_radius + jitter, u_radius - u_softness + jitter, dist);

    // Binaire: noir ou transparent
    light = step(0.5, light);

    c.rgb *= light;
    return c;
    }

  `
);

k.scene("level1", () => {
    const player = createPlayer(k, 120, 80);
    const key = createKey(k, 0, 0);
    const lighting = createLighting(k, player);
    const uiSquares = createUI(k, player);
    const enemy = createEnemy(k, uiSquares, 0,-500);
    const door = createDoor(k, 180, 180); 
    createKey(k, 0, 0);
    createWall(k, -700, 250,1800,200);
    createWall(k,-700,-500,200,800);
    createWindow(k,-500,-250);
    k.onUpdate(() => {
        k.setCamPos(player.pos);
    });
});

k.go("level1");

