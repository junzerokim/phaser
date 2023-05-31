import Mob from '../characters/Mob';
import { getRandomPosition } from './math';

/**
 * scene의 x, y 위치에 texture 이미지 및 animKey 애니메이션 실행
 * initHp의 HP, dropRate의 아이템 드랍율을 가진 Mob을 추가
 * PlayingScene의 m_mobs, m_mobEvent에 각각 mob, timer를 추가
 * 위치 x, y는 getRandomPosition 함수를 통해 결정
 * @param {Phaser.Scene} scene - mob을 등장시킬 scene
 * @param {Number} repeatGap - mob이 등장하는 간격
 * @param {String} mobTexture - mob의 image texture
 * @param {String} mobAnim - mob의 animation key
 * @param {Number} mobHp - mob의 최대 HP
 * @param {Number} mobDropRate - mob의 아이템 드랍율
 */
export function addMobEvent(scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate) {
  let timer = scene.time.addEvent({
    delay: repeatGap,
    callback: () => {
      // mob이 화면 바깥에서 나타남
      let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
      scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, mobDropRate));
    },
    loop: true,
  });

  scene.m_mobEvents.push(timer);
}

// 가장 오래된 mob event를 지우는 함수
export function removeOldestMobEvent(scene) {
  scene.m_mobEvents[0].remove();
  scene.m_mobEvents.shift();
}

export function addMob(scene, mobTexture, mobAnim, mobHp) {
  let [x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
  scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, 0));
}
