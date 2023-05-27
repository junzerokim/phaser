import Phaser from 'phaser';
import Config from '../Config';

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

    this.m_moving = false;
  }

  move(vector) {
    let PLAYER_SPEED = 3;

    this.x += vector[0] * PLAYER_SPEED;
    this.y += vector[1] * PLAYER_SPEED;

    if (vector[0] === -1) this.flipX = false;
    else if (vector[0] === 1) this.flipX = true;
  }
}
