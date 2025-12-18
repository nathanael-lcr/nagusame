export default function createPlayer(k, x = 120, y = 80) {
    const player = k.add([
        k.rect(40, 60),
        k.pos(x, y),
        "player",
    ]);

    k.onKeyDown("right", () => player.move(200, 0));
    k.onKeyDown("left",  () => player.move(-200, 0));
    k.onKeyDown("up",    () => player.move(0, -200));
    k.onKeyDown("down",  () => player.move(0, 200));

    return player;
}