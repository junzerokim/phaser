import game from '../index';
import Config from '../Config';

// pause된 scene을 저장할 변수
let scene_paused = null;
// pause된 시각 또는 pause가 해제된 시각을 저장할 변수
let time_paused = Date.now() - 100;
// pause 유형을 저장할 변수
let type_pause;

// pause의 유형에 따라 띄울 문구와 그 크기를 맵핑해준 객체
const PAUSE_TEXT_BY_TYPE = {
  pause: {
    text: 'Pause',
    fontSize: 60,
  },
  levelup: {
    text: ['LEVEL UP!', '', 'Press Enter to Keep Going'],
    fontSize: 40,
  },
};

// pause를 해주는 함수
export function pause(scene, type) {
  // scene이 pause 해제된 지 100ms가 지났고, scene이 active 하다면
  if (Date.now() - time_paused > 100 && game.scene.isActive(scene)) {
    // scene을 일시정지
    game.scene.pause(scene);
    // 각종 변수에 값을 설정
    scene_paused = scene;
    time_paused = Date.now();
    type_pause = type;

    // 검은 veil과 문구를 표시
    createVeil(scene);
    createPauseText(scene, type_pause);

    // pause 유형에 따라 다른 소리를 재생
    if (type_pause === 'pause') {
      game.scene.getScene(scene).m_pauseInSound.play();
    } else if (type_pause === 'levelup') {
      game.scene.getScene(scene).m_nextLevelSound.play();
    }
  }
}
// pause를 해제하는 event listener
document.addEventListener('keydown', (e) => {
  if (
    ((type_pause === 'pause' && e.key === 'Escape') || (type_pause === 'levelup' && e.key === 'Enter')) &&
    Date.now() - time_paused > 100 &&
    scene_paused
  ) {
    // scene을 재개(resume)
    const previousScene = game.scene.getScene(scene_paused);
    game.scene.resume(scene_paused);

    // veil과 문구를 제거
    togglePauseScreen(previousScene, false);

    // pause 해제 소리를 재생
    previousScene.m_pauseOutSound.play();

    // 레벨업으로 인한 일시정지였을 경우
    // pause 해제 후 PlayingScene의 afterLevelUp 함수를 실행
    if (type_pause === 'levelup') {
      previousScene.afterLevelUp();
    }
    // 각종 변수를 적절히 설정
    scene_paused = null;
    time_paused = Date.now();
  }
});
// scene에 반투명 검은 veil 화면을 만들어주는 함수
// 화면이 pause되어도 반투명한 화면을 통해 게임의 상황을 확인할 수 있도록 만듬
function createVeil(scene) {
  scene.m_veil = scene.add
    .graphics({ x: 0, y: 0 })
    .fillStyle(0x000000, 0.3)
    .fillRect(0, 0, Config.width, Config.height)
    .setDepth(110)
    .setScrollFactor(0);
}

// pause시 화면에 나타낼 텍스트를 만들어주는 함수
function createPauseText(scene, type) {
  scene.m_textPause = scene.add
    .text(Config.width / 2, Config.height / 2, PAUSE_TEXT_BY_TYPE[type].text, {
      fontSize: PAUSE_TEXT_BY_TYPE[type].fontSize,
    })
    .setOrigin(0.5) // Text 정중앙에 맞추기 위함
    .setDepth(120)
    .setScrollFactor(0);
}

// pause 화면(veil + text)을 띄우거나 내리는 함수
function togglePauseScreen(scene, isVisible) {
  scene.m_veil.setVisible(isVisible);
  scene.m_textPause.setVisible(isVisible);
}
