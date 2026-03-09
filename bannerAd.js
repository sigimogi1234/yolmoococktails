document.addEventListener('DOMContentLoaded', async () => {
  const { AdMob } = window.Capacitor.Plugins;

  try {
    // AdMob 초기화
    await AdMob.initialize({
      requestTrackingAuthorization: true,
    });

    // 배너 광고 보여주기
    await AdMob.showBanner({
      adId: 'ca-app-pub-5203792312344980/2831361633',
      adSize: 'ADAPTIVE_BANNER',
      position: 'TOP_CENTER', // 상단 배치
      margin: 0, // 상단에 딱 붙임 (CSS에서 여백 제어)
      // isTesting: true, // 테스트 시 활성화
    });

    // 광고가 성공적으로 로드되면 body에 클래스 추가
    document.body.classList.add('ad-visible');

  } catch (error) {
    console.error('AdMob 초기화 또는 광고 로드 실패:', error);
  }
});
