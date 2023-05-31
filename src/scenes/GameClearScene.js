import Phaser from 'phaser';
import Config from '../Config';
import Button from '../ui/Button';
import { getTimeString } from '../utils/time';

export default class GameClearScene extends Phaser.Scene {
  constructor() {
    // scene의 identifier 설정
    super('gameClearScene');
  }

  init(data) {
    this.m_mobsKilled = data.mobsKilled;
    this.m_level = data.level;
    this.m_secondElapsed = data.secondElapsed;
  }

  create() {
    // 배경 추가
    const bg = this.add.graphics();
    bg.fillStyle(0x5abeff);
    bg.fillRect(0, 0, Config.width, Config.height);
    bg.setScrollFactor(0);

    // 상단 문구 추가
    this.add.bitmapText(Config.width / 2, Config.height / 2 - 180, 'pixelFont', 'Game Clear', 80).setOrigin(0.5);

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
