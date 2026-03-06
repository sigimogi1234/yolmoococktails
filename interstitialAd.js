document.addEventListener('DOMContentLoaded', async () => {
    const { AdMob } = window.Capacitor.Plugins;

    let categoryClickCount = 0;
    let quizClickCount = 0;

    // 전면광고 미리 로드
    async function preloadAd() {
        try {
            await AdMob.prepareInterstitial({
                adId: 'ca-app-pub-5203792312344980/5704074580',
                // isTesting: true,
            });
            console.log('전면광고 미리 준비 완료');
        } catch (error) {
            console.error('전면광고 준비 실패:', error);
        }
    }

    await preloadAd();

    // ✅ 전면광고 표시 (공통)
    async function showInterstitialAd() {
        try {
            await AdMob.showInterstitial();
            console.log('전면광고 표시 완료');

            // 다음 광고 대비
            await preloadAd();
        } catch (error) {
            console.error('전면광고 표시 오류:', error);
        }
    }

    /* ==========================
       카테고리 클릭 (5회)
    ========================== */
    document.querySelectorAll('.mainSort li').forEach(item => {
        item.addEventListener('click', async () => {
            categoryClickCount++;

            if (categoryClickCount >= 5) {
                categoryClickCount = 0;
                await showInterstitialAd();
            }
        });
    });

    /* ==========================
       퀴즈 다음 버튼 클릭 (5회)
    ========================== */
    document.addEventListener('click', async (e) => {
        const nextBtn = e.target.closest('.answerNextBtnWrap .nextBtn');
        if (!nextBtn) return;

        quizClickCount++;

        if (quizClickCount >= 8) {
            quizClickCount = 0;
            await showInterstitialAd();
        }
    });
});


