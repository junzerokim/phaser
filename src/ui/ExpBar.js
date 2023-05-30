import Phaser from 'phaser';
import Config from '../Config';
import { clamp } from '../utils/math';

export default class ExpBar extends Phaser.GameObjects.Graphics {
  constructor(scene, maxExp) {
    super(scene);

    // ExpBar의 높이와 테두리 두께를 지정
    this.HEIGHT = 30;
    this.BORDER = 4;

    // ExpBar을 그릴 왼쪽 위 시작점을 지정
    this.m_x = 0;
    this.m_y = 30;
    // 최대 경험치 멤버 변수
    this.m_maxExp = maxExp;
    // 현재 경험치 멤버 변수
    this.m_currentExp = 0;
    // ExpBar를 그려주고, depth와 scroll factor를 설정
    this.draw();
    this.setDepth(100);
    this.setScrollFactor(0);

    // ExpBar를 화면에 추가
    scene.add.existing(this);
  }

  // 경험치를 amount만큼 증가시키고 ExpBar를 다시 그리는 메서드
  increase(amount) {
    this.m_currentExp = clamp(this.m_currentExp + amount, 0, this.m_maxExp);
    this.draw();
  }

  // 경험치를 0으로 초기화하고 ExpBar를 다시 그리는 메서드
  reset() {
    this.m_currentExp = 0;
    this.draw();
  }

  // ExpBar 도형을 그리는 메서드
  draw() {
    this.clear();

    // 검은색 배경을 그려서 테두리로 표시
    this.fillStyle(0x000000);
    this.fillRect(this.m_x, this.m_y, Config.width, this.HEIGHT);

    // 경험치 바의 흰색 배경을 그림
    this.fillStyle(0xffffff);
    this.fillRect(
      this.m_x + this.BORDER,
      this.m_y + this.BORDER,
      Config.width - 2 * this.BORDER,
      this.HEIGHT - 2 * this.BORDER
    );

    // 경험치 바의 경험치를 푸르게 그림
    // 푸른 부분이 전체의 (m_currentExp / m_maxExp * 100)%를 차지하도록 그림
    this.fillStyle(0x3665d5);
    let d = Math.floor(((Config.width - 2 * this.BORDER) / this.m_maxExp) * this.m_currentExp);
    this.fillRect(this.m_x + this.BORDER, this.m_y + this.BORDER, d, this.HEIGHT - 2 * this.BORDER);
  }
}
