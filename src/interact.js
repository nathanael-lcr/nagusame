export function createKey(k, x, y) {
    const keyInstance = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.anchor("center"),
        k.color(0, 255, 0),
        k.area({scale : 2.25}),
        "key",
    ]);
}

export function createDoor(k, x, y) {
    
    const door = k.add([
        k.rect(40, 80), 
        k.pos(x, y),
        k.color(255, 255, 0), 
        k.area(),
        k.body({ isStatic: true }), 
        "door",
    ]);

    
    function openDoor(doorObject) {
        k.destroy(doorObject);
        console.log("Porte ouverte !");
    }

    k.onCollide("player", "door", (player, door) => {
        if (player.hasKey) {
            openDoor(door);
        } else {
            console.log("Cette porte est verrouillée. Il vous faut une clé.");
        }
    });
}