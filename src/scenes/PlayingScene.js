import Phaser from 'phaser';
import Config from '../Config';
import Player from '../characters/Player';
import Mob from '../characters/Mob';
import { setBackground } from '../utils/backgroundManager';
import { addMobEvent } from '../utils/mobManager';
import { addAttackEvent } from '../utils/attackManager';

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
    // mobs
    this.m_mobs = this.physics.add.group();
    // 처음에 등장하는 몹을 수동으로 추가
    // 추가하지 않으면 closest mob을 찾는 부분에서 에러 발생
    this.m_mobs.add(new Mob(this, 0, 0, 'lion', 'lion_anim', 10));
    this.m_mobEvents = [];
    // scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
    addMobEvent(this, 10000, 'lion', 'lion_anim', 10, 0.9);

    // attacks
    // 정적인 공격과 동적인 공격의 동작 방식이 다르므로 따로 group을 생성
    // attack event를 저장하는 객체도 멤버 변수로 생성
    // 이는 공격 강화 등에 활용될 예정
    this.m_weaponDynamic = this.add.group();
    this.m_weaponStatic = this.add.group();
    this.m_attackEvents = {};
    // PlayingScene이 실행되면 바로 beam attack event를 추가
    addAttackEvent(this, 'beam', 10, 1, 1000);

    // collisions
    // Player와 mob이 부딪혔을 경우 player에 데미지 10을 준다
    this.physics.add.overlap(this.m_player, this.m_mobs, () => this.m_player.hitByMob(10), null, this);

    // mob이 dynamic 공격에 부딪혔을 경우 mob에 해당 공격 데미지만큼 데미지를 준다
    this.physics.add.overlap(
      this.m_weaponDynamic,
      this.m_mobs,
      (weapon, mob) => mob.hitByDynamic(weapon, weapon.m_damage),
      null,
      this
    );

    // mob이 static 공격에 부딪혔을 경우 mob에 해당 공격의 데미지만큼 데미지를 준다
    this.physics.add.overlap(
      this.m_weaponDynamic,
      this.m_mobs,
      (weapon, mob) => mob.hitByStatic(weapon, weapon.m_damage),
      null,
      this
    );
  }

  update() {
    this.movePlayerManager(this.m_cursorKeys, this.m_player);

    this.m_background.setX(this.m_player.x - Config.width / 2);
    this.m_background.setY(this.m_player.y - Config.height / 2);

    this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
    this.m_background.tilePositionY = this.m_player.y - Config.height / 2;

    // player로부터 가장 가까운 mob
    // 가장 가까운 mob은 mob, player의 움직임에 따라 계속 바뀌므로 update 내에서 구해야 함
    // getChildren: group에 속한 모든 객체들의 배열을 리턴
    const closest = this.physics.closest(this.m_player, this.m_mobs.getChildren());

    this.m_closest = closest;
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
