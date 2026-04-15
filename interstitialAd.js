document.addEventListener('DOMContentLoaded', async () => {
    const { AdMob } = window.Capacitor.Plugins;

    let categoryClickCount = 0;
    let navClickCount = 0;

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
        카테고리 클릭 (7회)
    ========================== */
    document.querySelectorAll('.mainSort li').forEach(item => {
        item.addEventListener('click', async () => {
            categoryClickCount++;

            if (categoryClickCount >= 7) {
                categoryClickCount = 0;
                await showInterstitialAd();
            }
        });
    });

    /* ==========================
        하단네비 클릭 (7회)
    ========================== */
    document.querySelectorAll('.navBtn').forEach(btn => {
        btn.addEventListener('click', async () => {

            // 🔥 퀴즈 중이면 광고 안뜨게 (추천)
            if (cardQuizWrap.classList.contains('on')) return;

            navClickCount++;

            if (navClickCount >= 7) { // 👉 숫자 조절 가능
                navClickCount = 0;
                await showInterstitialAd();
            }
        });
    });

    /* ==========================
        🔥 전면광고 - 처음으로
    ========================== */

    // 처음으로
    document.addEventListener('click', async (e) => {
        const returnBtn = e.target.closest('.returnBtn');
        if (!returnBtn) return;

        await showInterstitialAd();
    });
});


