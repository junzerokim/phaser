import Phaser from 'phaser';

export default class Mob extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animKey, initHp, dropRate) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(animKey);
    this.setDepth(10);
    this.scale = 1;

    // speed, hp, dropRate 멤버 변수 추가
    // speed를 몹마다 다르게 조절 가능
    this.m_speed = 50;
    this.m_hp = initHp;
    this.m_dropRate = dropRate;

    // 각 몹마다 사이즈에 맞게 body size, offset 설정
    if (texture === 'mob1') {
      this.setBodySize(24, 14);
      // mob1만 바닥을 기준으로 움직임 offset을 통해 기준을 바닥으로 설정
      this.setOffset(0, 14);
    }
    if (texture === 'mob2') {
      this.setBodySize(24, 32);
    }
    if (texture === 'mob3') {
      this.setBodySize(24, 32);
    }
    if (texture === 'mob4') {
      this.setBodySize(24, 32);
    }
    if (texture === 'lion') {
      this.setBodySize(40, 64);
    }

    // Mob이 0.1초마다 player 방향으로 움직임
    this.m_events = [];
    this.m_events.push(
      this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          // 누가, 누구를, n의 스피드로 따라감
          scene.physics.moveToObject(this, scene.m_player, this.m_speed);
        },
        loop: true,
      })
    );

    // Phaser.Scene에 update 함수가 있지만
    // Mob은 Phaser.Physics.Arcade.Sprite를 상속한 클래스로 update가 없기 때문에
    // Scene의 update가 실행될 때마다 mob도 update가 실행되게 구현
    scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
  }

  update() {
    // mob이 없을 경우의 예외처리
    if (!this.body) return;
    // 오른쪽으로 향할 시 오른쪽, 왼쪽을 향할 시 왼쪽
    if (this.x < this.scene.m_player.x) this.flipX = true;
    else this.flipX = false;
  }
}
