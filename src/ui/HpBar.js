import Phaser from 'phaser';
import { clamp } from '../utils/math';

export default class HpBar extends Phaser.GameObjects.Graphics {
  // HP bar를 추가할 scene, 위치를 위한 player, 최대 HP 값인 maxHp를 파라미터로 전달 받음
  constructor(scene, player, maxHp) {
    super(scene);

    // HP Bar의 width, height, border를 설정
    this.WIDTH = 40;
    this.HEIGHT = 6;
    this.BORDER = 1;

    // m_x, m_y로 HP bar의 맨 왼쪽 위 지점을 지정
    this.m_x = player.x - this.WIDTH / 2;
    this.m_y = player.y + 25;

    // 최대 HP, 현재 HP 값을 저장할 멤버 변수를 생성
    // 처음에는 HP가 최대
    this.m_maxHp = maxHp;
    this.m_currentHp = maxHp;
    // HP bar를 화면에 그림
    this.draw();
    // setScrollFactor는 화면이 이동해도 오브젝트의 위치가 고정되어 보이게 하는 함수
    this.setScrollFactor(0);
    // depth를 적절히 설정
    this.setDepth(20);

    scene.add.existing(this);
  }

  // HP를 증가시키고 HP bar를 다시 그리는 메소드
  increase(amount) {
    this.m_currentHp = clamp(this.m_currentHp + amount, 0, this.m_maxHp);
    this.draw();
  }

  // HP를 감소시키고 HP bar를 다시 그리는 메소드
  decrease(amount) {
    this.m_currentHp = clamp(this.m_currentHp - amount, 0, this.m_maxHp);
    this.draw();
  }

  // HP bar를 실제로 화면에 그려주는 메소드
  draw() {
    // 이전에 그렸던 HP bar는 제거
    this.clear();

    // HP bar의 border를 검은색으로 그림
    this.fillStyle(0x000000);
    this.fillRect(this.m_x, this.m_y, this.WIDTH, this.HEIGHT);

    // HP bar의 흰 HP 배경을 그림
    // 위에서 그린 검은색 사각형에서 상하좌우로 border만큼 안쪽으로 줄어든 흰색 사각형
    this.fillStyle(0xffffff);
    this.fillRect(
      this.m_x + this.BORDER,
      this.m_y + this.BORDER,
      this.WIDTH - 2 * this.BORDER,
      this.HEIGHT - 2 * this.BORDER
    );

    // 이제 HP를 그려줄 것
    // Hp가 30보다 적게 남았다면 빨간색, 30 이상이라면 초록색으로 채움
    if (this.m_currentHp < 30) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }

    // 총 HP가 100, 남은 HP가 n이라면 흰 HP 배경에서
    // 왼쪽에서부터 n%만 빨간색 또는 초록색 사각형을 그림
    let d = Math.floor(((this.WIDTH - 2 * this.BORDER) / this.m_maxHp) * this.m_currentHp);
    this.fillRect(this.m_x + this.BORDER, this.m_y + this.BORDER, d, this.HEIGHT - 2 * this.BORDER);
  }
}
