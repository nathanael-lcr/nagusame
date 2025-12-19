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
    
  for (let i = 0; i < 3; i++) {
    const square = k.add([
      k.rect(squareSize, squareSize),
      k.pos(startX + i * (squareSize + padding), startY),
      k.color(255, 0, 0),
      k.fixed(),
      k.layer("ui"),
    ]);

    squares.push(square);
  }

  // Mettre à jour les carrés selon la vie du joueur
  function updateUI() {
    const maxHealth = 3; // nombre total de carrés
    const healthPerSquare = 30 / maxHealth; // correspondance santé / carré
    for (let i = 0; i < squares.length; i++) {
      if (player.health <= i * healthPerSquare) {
        squares[i].hidden = true; // cacher le carré si perdu
      } else {
        squares[i].hidden = false;
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
