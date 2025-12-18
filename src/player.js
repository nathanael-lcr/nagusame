export default function createPlayer(k, x = 120, y = 80) {
    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        k.color(255, 0, 0),
        "player",
    ]);

    const baseSpeed = 200;
    const lerpFactor = 0.2;
    let mvmt = baseSpeed;
    let isSprinting = false;

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





    return player;
}
