// interact.js
// L'inventaire n'est pas nécessaire pour cette logique, mais vous pouvez le garder pour plus tard.
// let inventory = []; 

export function createKey(k, x, y) {
    const keyInstance = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.anchor("center"),
        k.color(0, 255, 0),
        k.area({scale : 2}),
        "key",
    ]);
}

export function createDoor(k, x, y) {
    
    const door = k.add([
        k.rect(40, 80), 
        k.pos(x, y),
        k.color(255, 255, 0), 
        k.area(),
        // Rend la porte solide pour que le joueur ne puisse pas passer à travers
        k.body({ isStatic: true }), 
        "door",
    ]);

    
    function openDoor(doorObject) {
        k.destroy(doorObject);
        console.log("Porte ouverte !");
    }

    //détecte la collision entre le joueur et la porte
    k.onCollide("player", "door", (player, door) => {
        if (player.hasKey) {
            openDoor(door);
        } else {
            console.log("Cette porte est verrouillée. Il vous faut une clé.");
        }
    });
}