import Phaser from 'phaser';
import Player from '../characters/Player';
import Config from '../Config';
import { setBackground } from '../utils/backgroundManager';
import { addMobEvent } from '../utils/mobManager';

export default class PlayingScene extends Phaser.Scene {
  constructor() {
    super('playGame');
  }

  create() {
    // 사용할 sound들을 추가
    // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이
    // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것
    this.sound.pauseOnBlur = false;
    this.m_beamSound = this.sound.add('audio_beam');
    this.m_scratchSound = this.sound.add('audio_scratch');
    this.m_hitMobSound = this.sound.add('audio_hitMob');
    this.m_growlSound = this.sound.add('audio_growl');
    this.m_explosionSound = this.sound.add('audio_explosion');
    this.m_expUpSound = this.sound.add('audio_expUp');
    this.m_hurtSound = this.sound.add('audio_hurt');
    this.m_nextLevelSound = this.sound.add('audio_nextLevel');
    this.m_gameOverSound = this.sound.add('audio_gameOver');
    this.m_gameClearSound = this.sound.add('audio_gameClear');
    this.m_pauseInSound = this.sound.add('audio_pauseIn');
    this.m_pauseOutSound = this.sound.add('audio_pauseOut');

    // player를 m_player라는 멤버 변수로 추가
    this.m_player = new Player(this);

    // camera가 player를 따라옴
    this.cameras.main.startFollow(this.m_player);

    // PlayingScene의 background를 설정
    setBackground(this, 'background1');

    this.m_cursorKeys = this.input.keyboard.createCursorKeys();

    // m_mobs는 physics group으로, 속한 모든 오브젝트에 동일한 물리법칙 적용 가능
    // m_mobEvents는 mob event의 timer를 담을 배열, mob event를 추가 및 제거 시 사용
    // addMobEvent는 m_mobEvents에 mob event의 timer를 추가
    this.m_mobs = this.physics.add.group();
    this.m_mobEvents = [];
    // scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
    addMobEvent(this, 1000, 'mob1', 'mob1_anim', 10, 0.9);
  }

  update() {
    this.movePlayerManager(this.m_cursorKeys, this.m_player);

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.height / 2;
  }

  // player가 움직이도록 해주는 함수
  movePlayerManager(keyboard, player) {
    // 이동 키가 눌려있으면 player_anim 애니메이션을 재생
    // 이동 키가 눌려있지 않으면 player_idle 애니메이션을 재생
    if (keyboard.left.isDown || keyboard.right.isDown || keyboard.up.isDown || keyboard.down.isDown) {
      if (!player.m_moving) {
        player.play('player_anim');
      }
      player.m_moving = true;
    } else {
      if (player.m_moving) {
        player.play('player_idle');
      }
      player.m_moving = false;
    }

    // vector를 사용해 움직임을 관리
    // vector = [x, y]
    // 왼쪽 키가 눌리면 [0] + 1, 오른쪽 키가 눌리면 [1] + 1
    let vector = [0, 0];
    if (keyboard.left.isDown) {
      vector[0] -= 1;
    } else if (keyboard.right.isDown) {
      vector[0] += 1;
    }

    if (keyboard.up.isDown) {
      vector[1] -= 1;
    } else if (keyboard.down.isDown) {
      vector[1] += 1;
    }

    // vector를 player의 파라미터로 넘김
    player.move(vector);
  }
}