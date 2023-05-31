import LoadingScene from './scenes/LoadingScene';
import MainScene from './scenes/MainScene';
import PlayingScene from './scenes/PlayingScene';
import GameOverScene from './scenes/GameOverScene';
// import GameClearScene from "./scenes/GameClearScene";

const Config = {
  // 게임 화면의 크기와 색을 설정
  width: 800,
  height: 600,
  backgroundColor: 0x000000,

  // 사용할 scene은 config의 scene 배열에 추가
  scene: [LoadingScene, MainScene, PlayingScene, GameOverScene],

  // pixelArt를 사용할 경우 pixelArt: true로 설정해야 선명하게 보임
  pixelArt: true,

  // 물리엔진은 arcade, matter 등이 있는데 가벼운 arcade를 사용할 것
  // .env 파일에 DEBUG=true로 설정되어 있으면 디버그 모드로 실행
  // 디버그 모드에서는 게임 오브젝트들이 차지하는 면적이 분홍색 경계선으로 표시
  // 움직이는 오브젝트의 경우 방향도 표시되어 더 편하게 개발 가능
  physics: {
    default: 'arcade',
    arcade: {},
  },
};

export default Config;
