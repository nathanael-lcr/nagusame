export default function createUI(k, player) {
    const squareSize = 30;
    const padding = 10;
    const margin = 20;
    const startY = 20;

    const maxSquares = 3;
    const totalWidth = maxSquares * squareSize + (maxSquares - 1) * padding;
    const startX = k.width() - totalWidth - margin;

    const squares = [];
    const staminaBar = [];
    
    // Créer les carrés de vie
    for (let i = 0; i < maxSquares; i++) {
        const square = k.add([
            k.rect(squareSize, squareSize),
            k.pos(startX + i * (squareSize + padding), startY),
            k.color(255, 0, 0),
            k.fixed(),
            k.layer("ui"),
        ]);
        squares.push(square);
    }

    // Créer la barre de stamina
    const staminaBarBg = k.add([
        k.rect(200, 10),
        k.pos(20, 30),
        k.color(60, 60, 60),
        k.fixed(),
        k.layer("ui"),
    ]);

    const staminaBarFill = k.add([
        k.rect(200, 10),
        k.pos(20, 30),
        k.color(255, 255, 255),
        k.fixed(),
        k.layer("ui"),
    ]);

    // Fonction pour mettre à jour la vie
    function updateHealthUI() {
        const healthPerSquare = 30 / maxSquares; // 30 est la santé max, 3 carrés
        
        for (let i = 0; i < squares.length; i++) {
            if (player.health <= i * healthPerSquare) {
                squares[i].hidden = true; // cacher le carré si perdu
            } else {
                squares[i].hidden = false;
            }
        }
    }

    // Fonction pour mettre à jour la stamina
    function updateStaminaUI() {
        // Assurez-vous que le joueur a une propriété maxStamina
        const maxStamina = player.maxStamina || 100;
        const currentStamina = player.stamina || 100;
        
        // Mettre à jour la largeur de la barre
        staminaBarFill.width = 200 * (currentStamina / maxStamina);
        
        // Changer la couleur selon la stamina
        if (currentStamina < maxStamina * 0.3) {
            staminaBarFill.color = k.color(255, 50, 50); // Rouge quand basse
        } else if (currentStamina < maxStamina * 0.6) {
            staminaBarFill.color = k.color(255, 200, 50); // Orange quand moyenne
        } else {
            staminaBarFill.color = k.color(255, 255, 255); // Blanc quand haute
        }
    }

    // Mettre à jour l'UI à chaque frame
    k.onUpdate(() => {
        updateHealthUI();
        updateStaminaUI();
    });

    // Retourner les éléments pour un accès externe si nécessaire
    return {
        squares,
        staminaBar: staminaBarFill,
        staminaBarBg,
        updateHealthUI,
        updateStaminaUI
    };
}