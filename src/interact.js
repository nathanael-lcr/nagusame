// interact.js
// L'inventaire n'est pas nécessaire pour cette logique, mais vous pouvez le garder pour plus tard.
// let inventory = []; 

export function createKey(k, x, y) {
    const keyInstance = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(0, 255, 0),
        k.area(),
        "key",
    ]);
}

export function createDoor(k, x, y) {
    
    const door = k.add([
        k.rect(40, 80), // Rendons la porte un peu plus haute
        k.pos(x, y),
        k.color(255, 255, 0), // Jaune
        k.area(),
        // Rend la porte solide pour que le joueur ne puisse pas passer à travers
        k.body({ isStatic: true }), 
        "door",
    ]);

    // Fonction pour "ouvrir" la porte (ici, on la détruit)
    function openDoor(doorObject) {
        k.destroy(doorObject);
        console.log("Porte ouverte !");
    }

    // On détecte la collision entre le joueur et la porte
    k.onCollide("player", "door", (player, door) => {
        // Si le joueur a la clé
        if (player.hasKey) {
            openDoor(door);
        } else {
            console.log("Cette porte est verrouillée. Il vous faut une clé.");
        }
    });
}