export default function createPlayer(k, x = 120, y = 80) {
    const SPEED = 200;
    let isTouchingKey = false;
    let hasKey = false;
    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(255, 0, 0),
        k.anchor("center"),
        area(),
        "player",
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

    k.onKeyDown("right", () => player.move(mvmt, 0));
    k.onKeyDown("left", () => player.move(-mvmt, 0));
    k.onKeyDown("up", () => player.move(0, -mvmt));
    k.onKeyDown("down", () => player.move(0, mvmt));


    onCollide("player", "key", ()=>{
        isTouchingKey = true;
    });

    
    onCollideEnd("player", "key", ()=>{
        isTouchingKey = false;
    });

    function takeKey(){
        const keysObjects = get("key");
        if(keysObjects[0]){
            destroy(keysObjects[0]);
            hasKey = true;
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
