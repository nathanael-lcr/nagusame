export default function createPlayer(k, x = 120, y = 80) {
    const SPEED = 200;

    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        "player",
    ]);

    k.onKeyDown("d", () => player.move(SPEED, 0));
    k.onKeyDown("right", () => player.move(SPEED, 0));
    k.onKeyDown("q", () => player.move(-SPEED, 0));
    k.onKeyDown("left", () => player.move(-SPEED, 0));
    k.onKeyDown("z", () => player.move(0, -SPEED));
    k.onKeyDown("up", () => player.move(0, -SPEED));
    k.onKeyDown("s", () => player.move(0, SPEED));
    k.onKeyDown("down", () => player.move(0, SPEED));

    return player;
}
