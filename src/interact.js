// interact.js
// L'inventaire n'est pas nécessaire pour cette logique, mais vous pouvez le garder pour plus tard.
// let inventory = [];

export function createKey(k, x, y) {
  k.loadSprite("key", "public/key.png", {
    sliceX: 3, // 3 frames horizontalement
    sliceY: 1, // 1 ligne
    anims: {
      idle: { from: 0, to: 2, speed: 2, loop: true }, // 3 frames par seconde
    },
  });
  const keyInstance = k.add([
    k.pos(x, y),
    k.sprite("key"),
    k.anchor("center"),
    k.area({ scale: 2 }),
    "key",
  ]);
  keyInstance.play("idle");
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

    k.onCollide("player", "door", (player, door) => {
        if (player.hasKey) {
            openDoor(door);
        } else {
            console.log("Cette porte est verrouillée. Il vous faut une clé.");
        }
    });
}
