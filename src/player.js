// player.js

export default function createPlayer(k, x = 120, y = 80) {
  let isTouchingKey = false;
  // 3 frames, chaque frame 32x32
  k.loadSprite("player", "public/tobby-sprite.png", {
    sliceX: 4, // nombre de frames par animation
    sliceY: 4, // nombre de directions : bottom, left, right, top (ou selon ton sheet)
    anims: {
      run_top: { from: 0, to: 3, speed: 6, loop: true }, // Row 0
      run_bottom: { from: 4, to: 7, speed: 6, loop: true }, // Row 1
      run_side: { from: 8, to: 11, speed: 6, loop: true }, // Row 2
      idle: { from: 12, to: 15, speed: 2, loop: true }, // Row 3
    },
  });

  const player = k.add([
    k.sprite("player"),
    k.pos(x, y),
    k.anchor("center"),
    k.area({ collisionIgnore: ["enemy"] }), // ignore these tags
    k.body(),
    k.layer("player"),
    k.z(10),
    "player",
    {
      hasKey: false,
    },
  ]);

  let moving = false;
  let lastDir = "bottom"; // "top" | "bottom" | "side"

  player.play("idle");

  const baseSpeed = 150;
  const lerpFactor = 0.2;
  let mvmt = baseSpeed;
  let isSprinting = false;

  player.health = 30;

  player.takeDamage = function (amount) {
    this.health -= amount;
    console.log(`Player damaged! Health: ${this.health}`);
    if (this.health <= 0) {
      console.log("Player is dead!");
      // Ici tu peux faire game over ou respawn
    }
  };

  k.onKeyDown("shift", () => {
    isSprinting = true;
    mvmt = baseSpeed * 1.8;
  });
  k.onKeyRelease("shift", () => {
    isSprinting = false;
    k.onUpdate(() => {
      if (!isSprinting) {
        mvmt = k.lerp(mvmt, baseSpeed, lerpFactor);
      }
    });
  });

  function playRun(dir, flip = false) {
    if (lastDir !== dir || !moving) {
      player.play(`run_${dir}`);
      player.flipX = flip;
      lastDir = dir;
    }
    moving = true;
  }

  function stopRun() {
    if (moving) {
      player.play("idle");
      moving = false;
    }
  }

  k.onKeyDown("d", () => {
    player.move(mvmt, 0);
    playRun("side", false);
  });

  k.onKeyDown("right", () => {
    player.move(mvmt, 0);
    playRun("side", false);
  });

  k.onKeyDown("q", () => {
    player.move(-mvmt, 0);
    playRun("side", true);
  });

  k.onKeyDown("left", () => {
    player.move(-mvmt, 0);
    playRun("side", true);
  });

  k.onKeyDown("z", () => {
    player.move(0, -mvmt);
    playRun("top");
  });

  k.onKeyDown("up", () => {
    player.move(0, -mvmt);
    playRun("top");
  });

  k.onKeyDown("s", () => {
    player.move(0, mvmt);
    playRun("bottom");
  });

  k.onKeyDown("down", () => {
    player.move(0, mvmt);
    playRun("bottom");
  });

  k.onCollide("player", "key", () => {
    isTouchingKey = true;
  });

  k.onCollideEnd("player", "key", () => {
    isTouchingKey = false;
  });

  k.onUpdate(() => {
    if (
      !k.isKeyDown("d") &&
      !k.isKeyDown("right") &&
      !k.isKeyDown("q") &&
      !k.isKeyDown("left") &&
      !k.isKeyDown("z") &&
      !k.isKeyDown("up") &&
      !k.isKeyDown("s") &&
      !k.isKeyDown("down")
    ) {
      stopRun();
    }
  });

  function takeKey() {
    const keysObjects = k.get("key");
    if (keysObjects[0]) {
      k.destroy(keysObjects[0]);
      player.hasKey = true;
      console.log("Clé obtenue !");
    }
  }

  k.onKeyPress("e", () => {
    if (isTouchingKey) {
      takeKey();
    }
  });

  k.onKeyPress("space", () => {
    if (isTouchingKey) {
      takeKey();
    }
  });

  return player;
}
