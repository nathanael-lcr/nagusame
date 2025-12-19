export default function createWindows(k, x, y,sizeX,sizeY,angle = 0) {
    const window = k.add([
        k.rect(sizeX, sizeY),
        k.pos(x, y),
        k.anchor("center"),
        k.area(),
        k.body({ isStatic: true }),
        k.color(100, 100, 100),
        "window",
    ]);

    const visionLength = 300;
    const visionAngle = Math.PI / 2;
    const currentAngle = angle;

    const windowWidth = 10;
    let currentVisionAngle = 0;
    let targetVisionAngle = 0;

    let isOpening = false;
    let isDetected = false;
    let hasTriggered = false;

    const openDuration = 1.5;
    const closeDuration = 1.0;
    const minClosedTime = 2;
    const maxClosedTime = 5;
    const minOpenTime = 3;
    const maxOpenTime = 6;

    let animationTimer = 0;
    let isAnimating = false;
    let animationDuration = 0;
    let startAngle = 0;
    let endAngle = 0;
    let startColor = 100;
    let endColor = 100;

    function rotateVec(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return k.vec2(
            v.x * cos - v.y * sin,
            v.x * sin + v.y * cos
        );
    }

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function easeInQuad(t) {
        return t * t;
    }

    function scheduleNextAction() {
        if (isOpening) {
            const waitTime = k.rand(minOpenTime, maxOpenTime);
            k.wait(waitTime, () => {
                closeWindow();
            });
        } else {
            const waitTime = k.rand(minClosedTime, maxClosedTime);
            k.wait(waitTime, () => {
                openWindow();
            });
        }
    }

    function openWindow() {
        isOpening = true;
        isAnimating = true;
        animationTimer = 0;
        animationDuration = openDuration;
        startAngle = currentVisionAngle;
        endAngle = Math.PI / 2;
        startColor = window.color.r;
        endColor = 200;
    }

    function closeWindow() {
        isOpening = false;
        isAnimating = true;
        animationTimer = 0;
        animationDuration = closeDuration;
        startAngle = currentVisionAngle;
        endAngle = 0;
        startColor = window.color.r;
        endColor = 100;
    }

    function isPlayerInVisionCone() {
        const player = k.get("player")[0];
        if (!player) return false;
        if (currentVisionAngle <= 0.01) return false;
        const toPlayer = player.pos.sub(window.pos);
        const dist = toPlayer.len();
        if (dist > visionLength) return false;

        const dir = k.vec2(
            Math.cos(currentAngle),
            Math.sin(currentAngle)
        );
        const forwardDist = toPlayer.dot(dir);
        if (forwardDist <= 0) return false;
        const perp = k.vec2(-dir.y, dir.x);
        const sideDist = Math.abs(toPlayer.dot(perp));
        const halfWidthAtDist = Math.tan(currentVisionAngle / 2) * forwardDist;

        return sideDist <= halfWidthAtDist;
    }

    const visionCone = k.add([
        k.pos(window.pos),
        k.opacity(0.3),
        "debug",
        {
            draw() {
                if (currentVisionAngle > 0.01) {
                    const dir = k.vec2(
                        Math.cos(currentAngle),
                        Math.sin(currentAngle)
                    );
                    const leftDir = rotateVec(dir, -currentVisionAngle / 2).scale(visionLength);
                    const rightDir = rotateVec(dir, currentVisionAngle / 2).scale(visionLength);
                    k.drawPolygon({
                        pts: [k.vec2(0, 0), leftDir, rightDir],
                        fill: true,
                        opacity: 0.3,
                        color: isDetected
                            ? k.rgb(255, 0, 0)
                            : k.rgb(255, 255, 0),
                    });
                }
            },
        },
    ]);

    visionCone.onUpdate(() => {
        visionCone.pos = window.pos;
        if (isAnimating) {
            animationTimer += k.dt();
            const progress = Math.min(animationTimer / animationDuration, 1);
            const easedProgress = isOpening ? easeOutQuad(progress) : easeInQuad(progress);
            currentVisionAngle = startAngle + (endAngle - startAngle) * easedProgress;
            const newColor = startColor + (endColor - startColor) * easedProgress;
            window.color = k.rgb(newColor, 100, 100);

            if (progress >= 1) {
                isAnimating = false;
                currentVisionAngle = endAngle;
                scheduleNextAction();
            }
        }

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

    // Démarrer le cycle d'animation
    k.wait(k.rand(0, 3), () => {
        openWindow();
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

    let timer = 0;
    const duration = 0.4;

    flash.onUpdate(() => {
        timer += k.dt();
        flash.opacity = 1 - (timer / duration);

        if (timer >= duration) {
            k.destroy(flash);
        }
    });
}