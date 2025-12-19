export default function createWindows(k, x, y) {
  const window = k.add([
    k.rect(10, 120),
    k.pos(x, y),
    k.anchor("center"),
    k.area(),
    k.body({ isStatic: true }),
    k.color(100, 100, 100),
    "window",
  ]);

  const visionLength = 300;
  const visionAngle = Math.PI / 2;
  const currentAngle = 0;
  const windowWidth = 10;
  let isDetected = false;
  let hasTriggered = false;

  function rotateVec(v, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return k.vec2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
  }

  function isPlayerInVisionCone() {
    const player = k.get("player")[0];
    if (!player) return false;

    const toPlayer = player.pos.sub(window.pos);
    const dist = toPlayer.len();
    if (dist > visionLength) return false;

    const dir = k.vec2(Math.cos(currentAngle), Math.sin(currentAngle));

    const forwardDist = toPlayer.dot(dir);
    if (forwardDist <= 0) return false;

    const perp = k.vec2(-dir.y, dir.x);
    const sideDist = Math.abs(toPlayer.dot(perp));

    const halfWidthAtDist =
      windowWidth / 2 + Math.tan(visionAngle / 2) * forwardDist;

    return sideDist <= halfWidthAtDist;
  }

  const visionCone = k.add([
    k.pos(window.pos),
    k.opacity(0.3),
    "debug",
    {
      draw() {
        const dir = k.vec2(Math.cos(currentAngle), Math.sin(currentAngle));
        const leftDir = rotateVec(dir, -visionAngle / 2).scale(visionLength);
        const rightDir = rotateVec(dir, visionAngle / 2).scale(visionLength);
        k.drawPolygon({
          pts: [k.vec2(0, 0), leftDir, rightDir],
          fill: true,
          opacity: 0.3,
          color: isDetected ? k.rgb(255, 0, 0) : k.rgb(255, 255, 0),
        });
      },
    },
  ]);
  visionCone.onUpdate(() => {
    visionCone.pos = window.pos;
    const detectedNow = isPlayerInVisionCone();
    isDetected = detectedNow;
    if (detectedNow && !hasTriggered) {
      hasTriggered = true;
      const player = k.get("player")[0];
      if (player) {
        player.takeDamage(10);
        player.pos = k.vec2(0, 0);
      }

      triggerFlashbang(k);
    }
    if (!detectedNow) {
      hasTriggered = false;
    }
  });
  return window;
}

function triggerFlashbang(k) {
  const flash = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.fixed(),
    k.color(255, 255, 255),
    k.opacity(1),
    k.z(1000),
  ]);

  k.tween(1, 0, 0.4, (o) => (flash.opacity = o), k.easings.linear);

  k.wait(0.4, () => {
    flash.destroy();
  });
}
