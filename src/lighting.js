// lighting.js - Pulsating light
export default function createLighting(k) {
  const BASE_RADIUS = 0.4; // base radius
  const PULSE_AMOUNT = 0.07; // how much it grows/shrinks
  const PULSE_SPEED = 0.5; // how fast it pulses

  const SOFTNESS = 0.06;
  const FLICKER_SPEED = 0.00002;

  k.usePostEffect("playerLight", () => {
    const time = k.time();
    const pulsatingRadius =
      BASE_RADIUS + Math.sin(time * PULSE_SPEED) * PULSE_AMOUNT;

    return {
      u_player_x: 0.5,
      u_player_y: 0.5,
      u_radius: pulsatingRadius,
      u_softness: SOFTNESS,
      u_aspect: k.width() / k.height(),
      u_time: time * FLICKER_SPEED,
    };
  });
}
