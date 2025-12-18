export function createWalls(k, x, y) {
    
    const keyInstance = k.add([
        k.rect(1800, 100),
        k.pos(x, y),
        k.color(0, 0, 0),
        k.area(),
        k.body({ isStatic: true }),
        "wall",
    ]);
    
    
}