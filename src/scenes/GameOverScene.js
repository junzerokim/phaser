import Phaser from 'phaser';
import Config from '../Config';
import Button from '../ui/Button';
import { getTimeString } from '../utils/time';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameOverScene');
  }

  // 데이터를 전달받기 위해 init 메서드를 사용
  init(data) {
    // 받아온 데이터를 멤버 변수로 저장
    this.m_mobsKilled = data.mobsKilled;
    this.m_level = data.level;
    this.m_secondElapsed = data.secondElapsed;
  }

  create() {
    // 배경 색을 칠해준다
    const bg = this.add.graphics();
    bg.fillStyle(0x5c6bc0);
    bg.fillRect(0, 0, Config.width, Config.height);
    // setScrollFactor는 화면이 이동해도 오브젝트의 위치가 고정되어 보이게 하는 함수
    bg.setScrollFactor(0);
    // 화면 가운데 'Game Over' 문구를 추가
    // setOrigin(0.5)를 통해 x축 방향으로 정가운데 위치
    this.add.bitmapText(Config.width / 2, Config.height / 2 - 180, 'pixelFont', 'Game Over', 80).setOrigin(0.5);

    // 플레이 시간을 표시
    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 2 - 30,
        'pixelFont',
        `You survived for ${getTimeString(this.m_secondElapsed)}`,
        40
      )
      .setOrigin(0.5);

    this.add
      .bitmapText(
        Config.width / 2,
        Config.height / 2 + 30,
        'pixelFont',
        `Mobs Killed : ${this.m_mobsKilled} Level : ${this.m_level}`,
        40
      )
      .setOrigin(0.5);

    new Button(Config.width / 2, Config.height / 2 + 180, 'Go to Main', this, () => this.scene.start('mainScene'));
  }
}
