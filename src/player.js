// player.js

export default function createPlayer(k, x = 120, y = 80) {

    let isTouchingKey = false;
    // La variable hasKey est supprimée d'ici, on va l'attacher à l'objet player

    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(100, 0, 200),
        k.anchor("center"),
        k.area(),
        k.body(),
        "player",
        {
            // On ajoute hasKey comme une propriété de l'objet joueur
            hasKey: false, 
        },
    ]);
  

    const baseSpeed = 200;
    const lerpFactor = 0.2;
    let mvmt = baseSpeed;
    let isSprinting = false;

    player.health = 30;

    player.takeDamage = function(amount) {
        this.health -= amount;
        console.log(`Player damaged! Health: ${this.health}`);
        if (this.health <= 0) {
            console.log("Player is dead!");
            k.go("death");
            // Ici tu peux faire game over ou respawn

        }
    };

    k.onKeyDown("shift", () => {
        isSprinting = true;
        mvmt = baseSpeed * 2;
    });
    k.onKeyRelease("shift", () => {
        isSprinting = false;
        k.onUpdate(() => {
            if (!isSprinting) {
                mvmt = k.lerp(mvmt, baseSpeed, lerpFactor);
            }
        });
    });

    k.onKeyDown("d", () => player.move(mvmt, 0));
    k.onKeyDown("right", () => player.move(mvmt, 0));
    k.onKeyDown("q", () => player.move(-mvmt, 0));
    k.onKeyDown("left", () => player.move(-mvmt, 0));
    k.onKeyDown("z", () => player.move(0, -mvmt));
    k.onKeyDown("up", () => player.move(0, -mvmt));
    k.onKeyDown("s", () => player.move(0, mvmt));
    k.onKeyDown("down", () => player.move(0, mvmt));

    // Correction : on ajoute le préfixe k.
    k.onCollide("player", "key", ()=>{
        isTouchingKey = true;
    });

    k.onCollideEnd("player", "key", ()=>{
        isTouchingKey = false;
    });

    function takeKey(){
        // Correction : on ajoute le préfixe k.
        const keysObjects = k.get("key");
        if(keysObjects[0]){
            k.destroy(keysObjects[0]);
            // On modifie la propriété de l'objet joueur
            player.hasKey = true; 
            console.log("Clé obtenue !");
        }
    }
   
    k.onKeyPress("e", () => {
        if(isTouchingKey){
            takeKey()
        }
    });

    k.onKeyPress("space", () => {
        if(isTouchingKey){
            takeKey();
        }
    });

    return player;
}