export function createWalls(k, x, y,sizex,sizey) {
    
    const keyInstance = k.add([
        k.rect(sizex, sizey),
        k.pos(x, y),
        k.color(0, 0, 0),
        k.area(),
        k.body({ isStatic: true }),
        "wall",
    ]);
    
    
}