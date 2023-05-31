import Phaser from 'phaser';
import Explosion from '../effects/Explosion';
import ExpUp from '../items/ExpUp';
import { removeAttack } from '../utils/attackManager';
import { winGame } from '../utils/sceneManager';

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
    this.m_isDead = false;

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
      this.m_speed = 60;
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

    // 공격 받을 수 있는지 여부를 뜻하는 멤버 변수
    // static 공격의 경우 처음 접촉했을 때 쿨타임을 주지 않으면
    // 매 프레임당 계속해서 공격한 것으로 처리되므로 해당 변수로 생성
    this.m_canBeAttacked = true;
  }

  update() {
    // mob이 없을 경우의 예외처리
    if (!this.body) return;
    // 오른쪽으로 향할 시 오른쪽, 왼쪽을 향할 시 왼쪽
    if (this.x < this.scene.m_player.x) this.flipX = true;
    else this.flipX = false;
    // HP가 0 이하가 되면 죽음
    if (this.m_hp <= 0 && !this.m_isDead) {
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
    // 보스몹이면 투명도를 조절하지 않음
    if (this.texture.key === 'lion') return;
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

  // 0.8초 쿨타임을 갖는 함수
  getCoolDown() {
    // 공격 받을 수 있는지 여부를 false로 변경하고 1초 후 true 변경
    this.m_canBeAttacked = false;
    this.scene.time.addEvent({
      delay: 800,
      callback: () => {
        this.m_canBeAttacked = true;
      },
      loop: false,
    });
  }

  die() {
    // 한번이라도 죽으면 die 메서드에 다시 들어오지 못하도록 m_isDead를 true로 변경
    this.m_isDead = true;
    // 폭발 효과 발생
    new Explosion(this.scene, this.x, this.y);
    this.scene.m_explosionSound.play();
    // dropRate의 확률로 item 드랍
    if (Math.random() < this.m_dropRate) {
      const expUp = new ExpUp(this.scene, this);
      this.scene.m_expUps.add(expUp);
    }
    // mob이 죽으면 TopBar의 mobs killed에 1을 더함
    this.scene.m_topBar.gainMobsKilled();
    // player 쪽으로 움직이게 만들었던 event 제거
    this.scene.time.removeEvent(this.m_events);

    // 보스몹이 죽었을 때
    if (this.texture.key === 'lion') {
      // 공격을 제거
      removeAttack(this.scene, 'catnip');
      removeAttack(this.scene, 'beam');
      removeAttack(this.scene, 'claw');
      // 플레이어가 보스몹과 접촉해도 HP가 깎이지 않도록 만듬
      this.disableBody(true, false);
      // 보스몹이 움직이던 애니메이션 정지
      this.play('lion_idle');
      // 모든 몹의 움직임 정지
      this.scene.m_mobs.children.each((mob) => {
        mob.m_speed = 0;
      });

      // 보스몹이 서서히 투명해짐
      this.scene.time.addEvent({
        delay: 30,
        callback: () => {
          this.alpha -= 0.01;
        },
        repeat: 100,
      });
      // 보스몹이 투명해진 후, GameClearScene으로 화면 전환
      this.scene.time.addEvent({
        delay: 4000,
        callback: () => {
          winGame(this.scene);
        },
        loop: false,
      });
    } else {
      // 몹이 사라짐
      this.destroy();
    }
  }
}
