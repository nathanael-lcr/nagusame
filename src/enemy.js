export default function createEnemy(
  k,
  uiSquares,
  centerX = 400,
  centerY = 300
) {
  const enemy = k.add([
    k.rect(40, 60),
    k.pos(centerX, centerY),
    k.anchor("center"),
    k.area(),
    // k.body(),
    k.color(255, 0, 0),
    "enemy",
  ]);

  const minStep = 100;
  const maxStep = 200;
  const speed = 100;
  const waitTime = 1.5;
  const attackDistance = 20;
  const attackCooldown = 1.5; // secondes entre chaque attaque
  let currentSpeed = speed; // vitesse actuelle de l'ennemi
  let canAttack = true;
  let attackSlowTime = 0.5; // durée pendant laquelle l'ennemi est ralenti
  let slowTimer = 0;

  let center = k.vec2(centerX, centerY);
  let target = enemy.pos.clone();
  let isWaiting = false;
  let isInvestigating = false;
  let isChasing = false;
  let isWaitingAtInvestigation = false;
  let lastSeenPlayerPos = null;
  let investigationCount = 0; // Compteur d'investigations
  let investigationResetTimer = 0; // Timer pour réinitialiser le compteur
  const maxInvestigations = 3; // Nombre d'investigations avant poursuite
  const investigationResetTime = 10; // Secondes avant de réinitialiser le compteur
  const investigationWaitTime = k.rand(2, 4); // Entre 2 et 4 secondes d'attente

  function randomStepAroundCenter() {
    const angle = Math.random() * Math.PI * 2;
    const r = k.rand(minStep, maxStep);
    let newPos = center.add(k.vec2(Math.cos(angle), Math.sin(angle)).scale(r));

    // Clamp x et y pour rester dans l'écran
    newPos.x = Math.max(0, Math.min(k.width(), newPos.x));
    newPos.y = Math.max(0, Math.min(k.height(), newPos.y));

    return newPos;
  }

  function pickNewTarget() {
    target = randomStepAroundCenter();
    isWaiting = false;
  }

  pickNewTarget();

  enemy.onUpdate(() => {
    if (isWaiting || isWaitingAtInvestigation) return;

    const dir = target.sub(enemy.pos);
    const dist = dir.len();

    const player = k.get("player")[0];
    if (!player) return;
    const distanceToPlayer = enemy.pos.dist(player.pos);
    // Gestion du cooldown et du ralentissement
    // Gestion du cooldown et du ralentissement

    if (!canAttack) {
      slowTimer += k.dt();
      currentSpeed = speed / 4; // Ralentir l'ennemi pendant le slow
      if (slowTimer >= attackCooldown) {
        canAttack = true;
        slowTimer = 0;
        currentSpeed = speed; // Retour à la vitesse normale
      }
    } else {
      currentSpeed = speed; // vitesse normale si pas en cooldown
    }

    // Attaque si le joueur est proche
    if (distanceToPlayer <= attackDistance && isChasing && canAttack) {
      console.log("Enemy caught the player!");
      player.takeDamage(10);
      // --- Mise à jour des carrés ---
      if (uiSquares.length > 0) {
        for (let i = uiSquares.length - 1; i >= 0; i--) {
          if (!uiSquares[i].hidden) {
            uiSquares[i].hidden = true;
            break; // on cache un seul carré par attaque
          }
        }
      }
      canAttack = false; // lance le cooldown
      slowTimer = 0;
      currentSpeed = speed / 4; // ralentir l'ennemi après attaque
    }

    // Déplacement vers le target
    if (dir.len() > 0) {
      enemy.move(dir.unit().scale(currentSpeed));
    }

    //console.log("Pos enemy:", enemy.pos, "Target:", target, "Dist:", dist.toFixed(2), "Investigation:", isInvestigating);

    if (dist < 5) {
      if (isInvestigating) {
        // Arrivé au point d'investigation → attendre 2-4 secondes
        isWaitingAtInvestigation = true;
        const waitDuration = investigationWaitTime;
        console.log(
          "Arrivé au point d'investigation (",
          investigationCount,
          "/",
          maxInvestigations,
          "), attente de",
          waitDuration.toFixed(1),
          "secondes"
        );
        isWaitingAtInvestigation = true;
        k.wait(waitDuration, () => {
          console.log("Fin de l'investigation, retour en patrouille");
          isInvestigating = false;
          isWaitingAtInvestigation = false;
          lastSeenPlayerPos = null;
          center = enemy.pos.clone();
          pickNewTarget();
        });
      } else if (isChasing) {
        // Arrivé en mode poursuite
        console.log(
          "Arrivé à la dernière position de poursuite, retour en patrouille"
        );
        isChasing = false;
        lastSeenPlayerPos = null;
        investigationCount = 0; // Réinitialiser le compteur après une poursuite
        center = enemy.pos.clone();
        pickNewTarget();
      } else {
        // Comportement normal de roaming
        isWaiting = true;
        k.wait(waitTime, pickNewTarget);
      }
      return;
    }

    enemy.move(dir.unit().scale(speed));
  });

  // Décrémenter le timer de réinitialisation
  enemy.onUpdate(() => {
    if (investigationCount > 0 && !isInvestigating && !isChasing) {
      investigationResetTimer += k.dt();
      if (investigationResetTimer >= investigationResetTime) {
        console.log(
          "Compteur d'investigations réinitialisé après",
          investigationResetTime,
          "secondes"
        );
        investigationCount = 0;
        investigationResetTimer = 0;
      }
    }
  });

  // Debug circle (suit le centre)
  const debugCircle = k.add([
    k.circle(maxStep),
    k.pos(center),
    k.outline(2),
    k.opacity(0.25),
    k.color(0, 255, 0),
    "debug",
  ]);

  debugCircle.onUpdate(() => {
    debugCircle.pos = center;
  });

  // Point de debug pour la position d'investigation
  const investigationPoint = k.add([
    k.circle(10),
    k.pos(centerX, centerY),
    k.anchor("center"),
    k.color(255, 0, 255),
    k.opacity(0),
    "debug",
  ]);

  investigationPoint.onUpdate(() => {
    if (isInvestigating || isChasing) {
      investigationPoint.opacity = 0.8;
      if (lastSeenPlayerPos) {
        investigationPoint.pos = lastSeenPlayerPos;
      }
    } else {
      investigationPoint.opacity = 0;
    }
  });

  function rotateVec(v, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return k.vec2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
  }

  const visionLength = 350;
  const visionAngle = Math.PI / 2;
  let currentAngle = 0;
  const rotationSpeed = 5;

  // Fonction pour vérifier si le joueur est dans le cône de vision
  function isPlayerInVisionCone() {
    const player = k.get("player")[0];
    if (!player) return { inCone: false, distance: 0 };

    const toPlayer = player.pos.sub(enemy.pos);
    const distToPlayer = toPlayer.len();

    if (distToPlayer > visionLength)
      return { inCone: false, distance: distToPlayer };

    const angleToPlayer = Math.atan2(toPlayer.y, toPlayer.x);

    let angleDiff = angleToPlayer - currentAngle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const inCone = Math.abs(angleDiff) <= visionAngle / 2;
    return { inCone, distance: distToPlayer };
  }

  // Créer le cône de vision en utilisant onDraw
  const visionCone = k.add([
    k.pos(enemy.pos),
    k.opacity(0.3),
    "debug",
    {
      draw() {
        const dir = k.vec2(Math.cos(currentAngle), Math.sin(currentAngle));
        const leftDir = rotateVec(dir, -visionAngle / 2).scale(visionLength);
        const rightDir = rotateVec(dir, visionAngle / 2).scale(visionLength);

        let coneColor;
        if (isChasing) {
          coneColor = k.rgb(255, 0, 0); // Rouge : poursuite active
        } else if (isInvestigating) {
          coneColor = k.rgb(255, 165, 0); // Orange : investigation
        } else {
          coneColor = k.rgb(255, 255, 0); // Jaune : patrouille normale
        }

        k.drawPolygon({
          pts: [k.vec2(0, 0), leftDir, rightDir],
          color: coneColor,
          opacity: 0.3,
          fill: true,
        });
      },
    },
  ]);

  // Mettre à jour la position et rotation du cône
  visionCone.onUpdate(() => {
    visionCone.pos = enemy.pos;

    const { inCone, distance } = isPlayerInVisionCone();

    if (inCone) {
      const player = k.get("player")[0];
      if (player) {
        // Si joueur à moins de la moitié de la portée → poursuite immédiate
        if (distance < visionLength / 2) {
          //console.log("Joueur très proche! Poursuite immédiate");
          isChasing = true;
          isInvestigating = false;
          isWaitingAtInvestigation = false;
          target = player.pos.clone();
          lastSeenPlayerPos = target.clone();
          isWaiting = false;
          investigationCount = 0;
          investigationResetTimer = 0;
        } else if (
          !isInvestigating &&
          !isChasing &&
          !isWaitingAtInvestigation
        ) {
          // Première détection → incrémenter le compteur
          investigationCount++;
          investigationResetTimer = 0; // Réinitialiser le timer de reset

          console.log(
            "Détection #",
            investigationCount,
            "/",
            maxInvestigations
          );

          if (investigationCount >= maxInvestigations) {
            // Trop d'investigations → passage en poursuite
            console.log("Trop d'investigations! Passage en mode poursuite");
            isChasing = true;
            isInvestigating = false;
            target = player.pos.clone();
            lastSeenPlayerPos = target.clone();
            isWaiting = false;
            investigationCount = 0;
          } else {
            // Investigation normale - FIXER LA POSITION UNE SEULE FOIS
            const investigationPos = player.pos.clone();
            lastSeenPlayerPos = investigationPos;
            target = investigationPos;
            isInvestigating = true;
            isWaiting = false;
            console.log("Investigation vers position fixe:", investigationPos);
          }
        }

        // En mode poursuite, continuer à suivre
        if (isChasing) {
          target = player.pos.clone();
          lastSeenPlayerPos = target.clone();
        }
        // NE PAS mettre à jour target en mode investigation!
      }
    } else {
      // Joueur plus visible
      if (isChasing) {
        console.log("Joueur perdu de vue, fin de poursuite");
        isChasing = false;
      }
      // NE PAS toucher à isInvestigating ici
    }

    const dir = target.sub(enemy.pos);
    if (dir.len() > 0) {
      const targetAngle = Math.atan2(dir.y, dir.x);

      let angleDiff = targetAngle - currentAngle;

      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      currentAngle += angleDiff * k.dt() * rotationSpeed;
    }
  });

  return enemy;
}
