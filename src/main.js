import kaplay from "kaplay";
import createPlayer from "./player.js";
import { createWall } from "./walls.js";
import { createKey, createDoor } from "./interact.js";
import createEnemy from "./enemy.js";
import createUI from "./UI.js";
import createWindow from "./window.js";

const k = kaplay();
const RUBIK_BURNED = "'Rubik Burned', cursive";
k.loadRoot("./");

// Fonction pour charger spécifiquement la police
function loadRubikBurned() {
    return new Promise((resolve) => {
        // Créer un élément texte invisible pour forcer le chargement
        const testElement = document.createElement('span');
        testElement.style.fontFamily = 'Rubik Burned';
        testElement.style.position = 'absolute';
        testElement.style.opacity = '0';
        testElement.textContent = '.';
        document.body.appendChild(testElement);
        
        // Vérifier avec l'API FontFace
        if (document.fonts) {
            document.fonts.load('16px "Rubik Burned"').then(() => {
                testElement.remove();
                resolve();
            }).catch(() => {
                setTimeout(() => {
                    testElement.remove();
                    resolve();
                }, 1000);
            });
        }
    });
}


k.scene("level1", () => {
    k.setBackground(50, 50, 50);
    const player = createPlayer(k, 120, 80);
    const key = createKey(k, 500, -800);
    const uiSquares = createUI(k, player);
    const enemy = createEnemy(k, uiSquares, 700, -500);
    const door = createDoor(k, 180, 180);
    createWall(k, -700, 250, 1800, 300); //mur bas
    createWall(k, -700, -1200, 350, 1500);//mur gauche
    createWall(k, 600, -1700, 300, 1500); //mur droit
    createWindow(k, -350, -600, 10, 120, 0);//fenetre gauche
    createWindow(k, 600, -400, 10, 120, Math.PI);//fenetre droite bas
    createWindow(k, 600, -1000, 10, 120, Math.PI);//fenetre droite haut
    createWindow(k, 800, 250, 120, 10, -Math.PI / 2); //fenetre bas

    k.onUpdate(() => {
        k.setCamPos(player.pos);
    });
});

k.scene("death", () => {
    k.setBackground(0, 0, 0);
    k.add([
        k.text("You got caught", {
            size: 64,
            font: RUBIK_BURNED
        }),
        k.color(255, 50, 50),
        k.pos(k.center()),
        k.anchor("center")
    ]);
    k.add([
        k.text("Press SPACE to restart", {
            size: 32,
            font: RUBIK_BURNED
        }),
        k.color(255, 255, 255),
        k.pos(k.center().x, k.center().y + 100),
        k.anchor("center")
    ]);
    
    k.onKeyPress("space", () => {
        k.go("level1");
    });
});

loadRubikBurned().then(() => {
    k.go("death");
});