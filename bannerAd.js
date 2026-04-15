document.addEventListener('DOMContentLoaded', async () => {
  const { AdMob } = window.Capacitor.Plugins;

  // 1. 기기의 Safe Area Top(노치 높이)을 구하는 함수
  const getSafeAreaTop = () => {
    const div = document.createElement('div');
    div.style.paddingTop = 'env(safe-area-inset-top)';
    div.style.position = 'fixed'; // 레이아웃에 영향 주지 않도록
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    
    // 계산된 스타일에서 픽셀값 추출
    const style = window.getComputedStyle(div);
    const top = parseInt(style.paddingTop) || 0;
    
    document.body.removeChild(div);
    return top;
  };

  try {
    // AdMob 초기화
    await AdMob.initialize({
      requestTrackingAuthorization: true,
    });

    const safeAreaTop = getSafeAreaTop();
    console.log('계산된 상단 노치 높이:', safeAreaTop);

    // 2. 배너 광고 보여주기
    await AdMob.showBanner({
      adId: 'ca-app-pub-5203792312344980/2831361633',
      adSize: 'ADAPTIVE_BANNER',
      position: 'TOP_CENTER',
      // margin에 계산된 노치 높이를 넣어 펀치홀 아래로 배치
      margin: safeAreaTop, 
      // isTesting: true,
    });

    // 광고가 성공적으로 로드되면 body에 클래스 추가
    document.body.classList.add('ad-visible');

  } catch (error) {
    console.error('AdMob 초기화 또는 광고 로드 실패:', error);
  }
});
