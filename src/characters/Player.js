import Phaser from 'phaser';
import Config from '../Config';
import HpBar from '../ui/HpBar';
import { loseGame } from '../utils/sceneManager';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    // 화면의 가운데에 player를 추가
    super(scene, Config.width / 2, Config.height / 2, 'player');
    // scene.add.existing : scene에 player를 추가
    scene.add.existing(this);
    // scene.physics.add.existing : scene의 물리엔진에 오브젝트를 추가
    scene.physics.add.existing(this);

    // scale 프로퍼티를 조절해 크기를 조절 (디폴트: 1)
    this.scale = 1;

    // depth를 조절해 어떤 오브젝트가 앞에 오고 뒤에 올지 설정
    // CSS의 z-index와 비슷한 개념 (디폴트: 0)
    this.setDepth(20);

    // 해당 오브젝트가 물리적으로 얼만큼의 면적을 차지할 지 설정하는 함수
    // 디폴트로 이미지 사이즈로 설정되는데, 그러면 추후 몹을 추가했을 때 너무 잘 부딪히는 느낌이 드므로 원본 이미지보다 약간 작게 설정
    this.setBodySize(28, 32);
    // 걷기 애니메이션 재생 여부를 위한 멤버 변수
    this.m_moving = false;

    // player가 공격 받을 수 있는지 여부를 나타내는 멤버 변수
    // 공격 받은 후 쿨타임을 주기 위해 사용
    this.m_canBeAttacked = true;

    // HP Bar를 player의 멤버 변수로 추가
    // scene, player, maxHp
    this.m_hpBar = new HpBar(scene, this, 100);
  }

  // player가 움직이도록 하는 함수
  move(vector) {
    let PLAYER_SPEED = 3;

    this.x += vector[0] * PLAYER_SPEED;
    this.y += vector[1] * PLAYER_SPEED;

    // 왼쪽을 바라볼 때 왼쪽을, 오른쪽을 바라볼 때 오른쪽을 바라봄
    if (vector[0] === -1) this.flipX = false;
    else if (vector[0] === 1) this.flipX = true;
  }

  // mob과 접촉했을 경우 실행되는 함수
  hitByMob(damage) {
    // 쿨타임이었던 경우 공격을 받지 않는다
    if (!this.m_canBeAttacked) return;

    // player가 다친 소리를 재생
    // this.scene.m_hurtSound.play();
    // 쿨타임을 갖는다
    this.getCoolDown();

    this.m_hpBar.decrease(damage);

    // HP가 0 이하가 되면 loseGame 함수 실행
    if (this.m_hpBar.m_currentHp <= 0) {
      loseGame(this.scene);
    }
  }

  getCoolDown() {
    this.m_canBeAttacked = false;
    this.alpha = 0.5;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.alpha = 1;
        this.m_canBeAttacked = true;
      },
      callbackScope: this,
      loop: false,
    });
  }
}
