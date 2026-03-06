document.addEventListener('DOMContentLoaded', async () => {
  const { AdMob } = window.Capacitor.Plugins;

  // AdMob 초기화
  await AdMob.initialize({
    requestTrackingAuthorization: true,
    // initializeForTesting: true,
  });

  // 배너 광고 보여주기
  await AdMob.showBanner({
    adId: 'ca-app-pub-5203792312344980/2831361633',
    adSize: 'ADAPTIVE_BANNER',
    position: 'BOTTOM_CENTER',
    margin: 40,
    // isTesting: true,
  });
});
