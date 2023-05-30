// 게임에서 졌을 때 진 효과음을 재생
// GameOverScene으로 전환시키는 함수
export function loseGame(playingScene) {
  playingScene.m_gameOverSound.play();
  playingScene.scene.start('gameOverScene');
}
