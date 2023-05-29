import Beam from '../effects/Beam';

/**
 * scene에 attackType 타입의 공격 이벤트를 추가
 * 공격은 repeatGap ms 간격으로 계속해서 발생
 * @param {Phaser.Scene} scene - attack을 발생시킬 scene
 * @param {String} attackType - attack의 유형
 * @param {Number} attackDamage - attack이 mob에 입히는 데미지
 * @param {Number} attackScale - attack의 크기
 * @param {Number} repeatGap - attack의 반복 간격
 */
export function addAttackEvent(scene, attackType, attackDamage, attackScale, repeatGap) {
  // 다양한 attackType이 생길 것을 대비하여 switch case문 사용
  switch (attackType) {
    case 'beam':
      const timerBeam = scene.time.addEvent({
        delay: repeatGap,
        callback: () => {
          shootBeam(scene, attackDamage, attackScale);
        },
        loop: true,
      });
      scene.m_attackEvents.beam = timerBeam;
      break;

    default:
      break;
  }

  function shootBeam(scene, damage, scale) {
    // scene, startingPosition, damage, scale
    new Beam(scene, [scene.m_player.x, scene.m_player.y - 16], damage, scale);
  }
}
