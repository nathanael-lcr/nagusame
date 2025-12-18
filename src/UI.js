// UI.js
export default function createUI(k, player) {
  const squareSize = 30;
  const padding = 10;
  const margin = 20; // marge depuis le bord droit
  const startY = 20;

  const maxSquares = 3;
  const totalWidth = maxSquares * squareSize + (maxSquares - 1) * padding;

  const startX = k.width() - totalWidth - margin;

  const squares = [];

  for (let i = 0; i < 3; i++) {
    const square = k.add([
      k.rect(squareSize, squareSize),
      k.pos(startX + i * (squareSize + padding), startY),
      k.color(255, 0, 0),
      k.fixed(), // UI fixe à l’écran
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
  }

  // Hook pour mettre à jour automatiquement
  k.onUpdate(() => {
    updateUI();
  });

  return squares;
}
