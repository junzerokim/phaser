import Phaser from 'phaser';

export default class Beam extends Phaser.Physics.Arcade.Sprite {
  // Beam은 파라미터로 x, y 대신 startingPosition
  // startingPosition = [x, y]인 배열
  constructor(scene, startingPosition, damage, scale) {
    super(scene, startingPosition[0], startingPosition[1], 'beam');

    // beam의 속도, 지속시간을 설정
    this.SPEED = 100;
    this.DURATION = 1500;

    scene.add.existing(this);
    // 충돌이나 업데이트를 관리
    scene.physics.world.enableBody(this);
    // 동적 공격 그룹에 beam 추가
    scene.m_weaponDynamic.add(this);
    // beam 소리 재생
    // scene.m_beamSound.play();

    // 데미지, 크기, depth 설정
    this.m_damage = damage;
    this.scale = scale;
    this.setDepth(30);
    // velocity, angle 설정. 이는 직접 정의할 메소드
    this.setVelocity();
    this.setAngle();

    scene.time.addEvent({
      delay: this.DURATION,
      callback: () => {
        this.destroy();
      },
      loop: false,
    });
  }

  // beam이 가장 가까운 mob으로 날아가도록 속도를 설정
  setVelocity() {
    // 가장 가까운 mob이 없을 경우 beam이 위로 날아가도록 설정
    if (!this.scene.m_closest) {
      this.setVelocityY(-250);
      return;
    }
    const _x = this.scene.m_closest.x - this.x;
    const _y = this.scene.m_closest.y - this.y;
    const _r = Math.sqrt(_x * _x + _y * _y) / 2;
    this.body.velocity.x = (_x / _r) * this.SPEED;
    this.body.velocity.y = (_y / _r) * this.SPEED;
  }
  // beam이 mob에 날아갈 때 beam 이미지의 각도를 설정
  // 설정하지 않아도 기능적으로는 무방하지만 beam의 모습이 어색
  setAngle() {
    // Player와 Mob 사이의 각도
    if (this.scene.m_closest) {
      const angleToMob = Phaser.Math.Angle.Between(this.x, this.y, this.scene.m_closest.x, this.scene.m_closest.y);
      // beam 이미지의 각도를 설정
      // 다음 문을 각각 주석 해제한 뒤 beam의 모습을 확인
      this.rotation = angleToMob + Math.PI / 2 + Math.PI / 4;

      // angular velocity는 회전 속도를 의미하는데
      // beam이 회전하지는 않으므로 0으로 설정
      this.body.setAngularVelocity(0);
    }
  }

  // beam의 damage를 설정
  setDamage(damage) {
    this.m_damage = damage;
  }
}
