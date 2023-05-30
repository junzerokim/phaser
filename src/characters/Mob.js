import Phaser from 'phaser';
import Explosion from '../effects/Explosion';
import ExpUp from '../items/ExpUp';

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
    // HP가 0 이하가 되면 죽음
    if (this.m_hp <= 0) {
      this.die();
    }
  }

  // mob이 dynamic attack에 맞을 경우 실행되는 함수
  hitByDynamic(weaponDynamic, damage) {
    // 공격에 맞은 소리를 재생
    // this.scene.m_hitMobSound.play();
    // mob의 hp에서 damage만큼 감소
    this.m_hp -= damage;
    // 공격 받은 mob의 투명도를 1초간 조절함으로써 공격 받은 것을 표시
    this.displayHit();

    // dynamic 공격을 제거
    weaponDynamic.destroy();
  }

  // mob이 static attack에 맞을 경우 실행되는 함수
  hitByStatic(damage) {
    // 쿨타임인 경우 바로 리턴
    if (!this.m_canBeAttacked) return;

    // 공격에 맞은 소리를 재생
    // this.scene.m_hitMobSound.play();
    // mob의 hp에서 damage만큼 감소
    this.m_hp -= damage;
    // 공격받은 몹의 투명도를 1초간 조절함으로써 공격 받은 것을 표시
    this.displayHit();
    // 쿨타임을 갖는다
    this.getCoolDown();
  }

  // 공격받은 mob의 투명도를 1초간 조절함으로써 공격받은 것을 표시
  displayHit() {
    // mob의 투명도 0.5로 변경하고, 1초 후 1 변경
    this.alpha = 0.5;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.alpha = 1;
      },
      loop: false,
    });
  }

  // 1초 쿨타임을 갖는 함수
  getCoolDown() {
    // 공격 받을 수 있는지 여부를 false로 변경하고 1초 후 true 변경
    this.m_canBeAttacked = false;
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.m_canBeAttacked = true;
      },
      loop: false,
    });
  }

  die() {
    // 폭발 효과 발생
    new Explosion(this.scene, this.x, this.y);
    this.scene.m_explosionSound.play();
    // dropRate의 확률로 item 드랍
    if (Math.random() < this.m_dropRate) {
      const expUp = new ExpUp(this.scene, this);
      this.scene.m_expUps.add(expUp);
    }
    // player 쪽으로 움직이게 만들었던 event 제거
    this.scene.time.removeEvent(this.m_events);
    // mob 객체 제거
    this.destroy();
  }
}
