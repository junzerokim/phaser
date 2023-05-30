import Phaser from 'phaser';

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'explosion');

    // 크기와 depth를 적절히 설정
    this.scale = 1;
    this.setDepth(50);
    // 폭발 애니메이션을 실행
    // 이 애니메이션은 한번만 실행되고 사라짐
    this.play('explode');
    scene.add.existing(this);
  }
}
