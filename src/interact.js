let inventory = [];

export function createKey(k, x, y) {
    
    const keyInstance = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(0, 255, 0),
        area(),
        "key",
    ]);
    
}
