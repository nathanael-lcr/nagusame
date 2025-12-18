export default function createPlayer(k, x = 120, y = 80) {
    const SPEED = 200;
    let isTouchingKey = false;
    let hasKey = false;
    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(255, 0, 0),
        area(),
        "player",
    ]);
    const baseSpeed = 200;
    let mvmt = baseSpeed;

    k.onKeyDown("shift", () => mvmt = baseSpeed*2)
    k.onKeyRelease("shift", () => mvmt =baseSpeed);
    k.onKeyDown("d", () => player.move(mvmt, 0));
    k.onKeyDown("right", () => player.move(mvmt, 0));
    k.onKeyDown("q", () => player.move(-mvmt, 0));
    k.onKeyDown("left", () => player.move(-mvmt, 0));
    k.onKeyDown("z", () => player.move(0, -mvmt));
    k.onKeyDown("up", () => player.move(0, -mvmt));
    k.onKeyDown("s", () => player.move(0, mvmt));
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
