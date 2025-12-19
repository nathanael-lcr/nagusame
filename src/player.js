export default function createPlayer(k, x = 120, y = 80) {

    let isTouchingKey = false;
    let currentKey = null;

    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(100, 0, 200),
        k.anchor("center"),
        k.area(),
        k.body(),
        "player",
        {
            hasKey: false,
        },
    ]);

    player.health = 30;

    player.takeDamage = function (amount) {
        this.health -= amount;
        console.log(`Player damaged! Health: ${this.health}`);
        if (this.health <= 0) {
            console.log("Player is dead!");
            k.go("death");
            // Ici tu peux faire game over ou respawn

        }
    };

    const baseSpeed = 200;
    let mvmt = baseSpeed;
    let isSprinting = false;

    //STAMINA 
    player.maxStamina = 100;
    player.stamina = 100;

    const STAMINA_DRAIN = 30;
    const STAMINA_REGEN = 20;

    // sprint
    k.onKeyDown("shift", () => {
        if (player.stamina > 0) {
            isSprinting = true;
            mvmt = baseSpeed * 1.8;
        }
    });

    k.onKeyRelease("shift", () => {
        isSprinting = false;
        mvmt = baseSpeed;
    });

    k.onKeyDown("d", () => player.move(mvmt, 0));
    k.onKeyDown("right", () => player.move(mvmt, 0));
    k.onKeyDown("q", () => player.move(-mvmt, 0));
    k.onKeyDown("left", () => player.move(-mvmt, 0));
    k.onKeyDown("z", () => player.move(0, -mvmt));
    k.onKeyDown("up", () => player.move(0, -mvmt));
    k.onKeyDown("s", () => player.move(0, mvmt));
    k.onKeyDown("down", () => player.move(0, mvmt));

    // STAMINA UPDATE
    k.onUpdate(() => {
        if (isSprinting && player.stamina > 0) {
            player.stamina -= STAMINA_DRAIN * k.dt();

            if (player.stamina <= 0) {
                player.stamina = 0;
                isSprinting = false;
                mvmt = baseSpeed;
            }
        }

        if (!isSprinting && player.stamina < player.maxStamina) {
            player.stamina += STAMINA_REGEN * k.dt();
            if (player.stamina > player.maxStamina) {
                player.stamina = player.maxStamina;
            }
        }
    });

    k.onCollide("player", "key", (player, key) => {
        isTouchingKey = true;
        currentKey = key;
    });

    k.onCollideEnd("player", "key", () => {
        isTouchingKey = false;
        currentKey = null;
    });

    function takeKey() {
        if (currentKey && !player.hasKey) {
            k.destroy(currentKey);
            player.hasKey = true;
            console.log("Clé obtenue !");
        }
    }

    k.onKeyPress("e", () => {
        if (isTouchingKey) takeKey();
    });

    k.onKeyPress("space", () => {
        if (isTouchingKey) takeKey();
    });

    return player;
}
