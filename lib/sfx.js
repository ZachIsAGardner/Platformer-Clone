class SFX {
  constructor() {
    const jump = new Audio ("assets/audio/sfx/smw_jump.wav");
    const coin = new Audio ("assets/audio/sfx/smw_coin.wav");
    const stomp = new Audio ("assets/audio/sfx/smw_stomp.wav");
    const bonk = new Audio ("assets/audio/sfx/smw_shell_ricochet.wav");
    this.sounds = {
      jump,
      coin,
      stomp,
      bonk
    };
  }
}

module.exports = SFX;
