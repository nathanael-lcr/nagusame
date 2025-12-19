export default function createPlayer(k, x = 120, y = 80) {
  let isTouchingKey = false;
  
  k.loadSprite("player", "public/tobby-sprite.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      run_top: { from: 0, to: 3, speed: 6, loop: true },
      run_bottom: { from: 4, to: 7, speed: 6, loop: true },
      run_side: { from: 8, to: 11, speed: 6, loop: true },
      idle: { from: 12, to: 15, speed: 2, loop: true },
    },
  });

  const player = k.add([
    k.sprite("player"),
    k.pos(x, y),
    k.anchor("center"),
    k.area({ collisionIgnore: ["enemy"] }),
    k.body(),
    k.layer("player"),
    k.z(10),
    "player",
    {
      hasKey: false,
    },
  ]);

  let moving = false;
  let lastDir = "bottom";
  player.play("idle");

  const baseSpeed = 150;
  const lerpFactor = 0.2;
  let mvmt = baseSpeed;
  let isSprinting = false;

  player.health = 30;
  player.maxStamina = 100;
  player.stamina = 100;

  const STAMINA_DRAIN = 30;
  const STAMINA_REGEN = 20;

  player.takeDamage = function (amount) {
    this.health -= amount;
    console.log(`Player damaged! Health: ${this.health}`);
    if (this.health <= 0) {
      console.log("Player is dead!");
      k.go("death");
    }
  };

  // ✅ UN SEUL onUpdate pour tout gérer
  k.onUpdate(() => {
    // Gestion du sprint et stamina
    if (isSprinting && player.stamina > 0) {
      player.stamina -= STAMINA_DRAIN * k.dt();
      mvmt = baseSpeed * 1.8;

      if (player.stamina <= 0) {
        player.stamina = 0;
        isSprinting = false;
        mvmt = baseSpeed;
      }
    }

    // Régénération de la stamina
    if (!isSprinting && player.stamina < player.maxStamina) {
      player.stamina += STAMINA_REGEN * k.dt();
      if (player.stamina > player.maxStamina) {
        player.stamina = player.maxStamina;
      }
    }

    // Lerp du mouvement quand on ne sprinte pas
    if (!isSprinting && mvmt > baseSpeed) {
      mvmt = k.lerp(mvmt, baseSpeed, lerpFactor);
    }

    // Gestion de l'idle
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

  // Sprint
  k.onKeyDown("shift", () => {
    if (player.stamina > 0) {
      isSprinting = true;
    }
  });

  k.onKeyRelease("shift", () => {
    isSprinting = false;
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

  // Mouvements
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

  // Collision clé
  k.onCollide("player", "key", () => {
    isTouchingKey = true;
  });

  k.onCollideEnd("player", "key", () => {
    isTouchingKey = false;
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