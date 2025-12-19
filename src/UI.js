export default function createUI(k, player) {
    const squareSize = 30;
    const padding = 10;
    const margin = 20;
    const startY = 20;

    const maxSquares = 3;
    const totalWidth = maxSquares * squareSize + (maxSquares - 1) * padding;
    const startX = k.width() - totalWidth - margin;

    const squares = [];

    for (let i = 0; i < maxSquares; i++) {
        const square = k.add([
            k.rect(squareSize, squareSize),
            k.pos(startX + i * (squareSize + padding), startY),
            k.color(255, 0, 0),
            k.fixed(),
        ]);
        squares.push(square);
    }

    function updateHealthUI() {
        const healthPerSquare = 30 / maxSquares;
        for (let i = 0; i < squares.length; i++) {
            squares[i].hidden = player.health <= i * healthPerSquare;
        }
    }

    const staminaBarBg = k.add([
        k.rect(200, 10),
        k.pos(20, 30),
        k.color(60, 60, 60),
        k.fixed(),
    ]);

    const staminaBar = k.add([
        k.rect(200, 10),
        k.pos(20, 30),
        k.color(255, 255, 255),
        k.fixed(),
    ]);

    k.onUpdate(() => {
        updateHealthUI();
        staminaBar.width =
            200 * (player.stamina / player.maxStamina);
    });

    return squares;
}
