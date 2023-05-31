import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Text {
  constructor(x, y, label, scene, callback) {
    super(scene, x, y, label);

    // setOrigin(0.5) -> 추가하는 위치(x, y)의 가운데 버튼 위치
    this.setOrigin(0.5)
      // 글자와 테두리 사이의 여백을 설정
      .setPadding(10)
      // 버튼의 색과 글씨 크기를 설정
      .setStyle({ backgroundColor: '#8aacc8', fontSize: 20 })
      // 버튼이 커서와 상호작용
      .setInteractive({ useHandCursor: true })
      // 누르면 callback으로 전달받은 함수를 실행
      .on('pointerdown', () => callback())
      // 커서가 올라가있을 때 글씨를 검은색으로 설정
      .on('pointerover', () => this.setStyle({ fill: '#000' }))
      // 커서가 올라가있지 않을 때 글씨를 흰색으로 설정
      .on('pointerout', () => this.setStyle({ fill: '#fff' }));

    // 화면에 버튼을 추가
    scene.add.existing(this);
  }
}
