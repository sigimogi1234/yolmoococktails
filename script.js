// =========================
// 리뷰 모달 개선판 (질문형)
// =========================

const TEST_MODE = false; // true로 설정하면 실제 리뷰 호출 없이 로직 테스트 가능

const reviewModal = document.getElementById('reviewModal');
const reviewBox = document.querySelector('.review-box');
const closeBtn = document.getElementById('closeReview');
const btnPositive = document.getElementById('btnPositive');
const btnNegative = document.getElementById('btnNegative');
const nextBtn = document.querySelector('.nextBtn');

let quizCount = 0;

function showReviewModal() {
    reviewModal.classList.add('show');
}

function closeReviewModal() {
    reviewModal.classList.remove('show');
}

// 닫기 로직
closeBtn.addEventListener('click', closeReviewModal);
reviewModal.addEventListener('click', (e) => {
    if (!reviewBox.contains(e.target)) closeReviewModal();
});

// [긍정] 버튼 클릭 시
btnPositive.addEventListener('click', async () => {
    console.log("긍정 응답: 인앱 리뷰 호출");

    try {
        const InAppReview = window.Capacitor?.Plugins?.InAppReview;

        if (InAppReview && typeof InAppReview.requestReview === 'function') {
            if (!TEST_MODE) {
                await InAppReview.requestReview();
            } else {
                console.log("테스트 모드: 실제 호출 시뮬레이션");
            }
        }
    } catch (e) {
        console.error("리뷰 호출 에러:", e);
    }

    closeReviewModal();
    if (!TEST_MODE) localStorage.setItem('reviewShown', 'true');
});

// [부정] 버튼 클릭 시
btnNegative.addEventListener('click', () => {
    console.log("부정 응답: 모달만 닫음");
    // 여기에 추가 피드백 링크(구글 폼 등)를 넣으면 더 좋습니다.
    closeReviewModal();
    if (!TEST_MODE) localStorage.setItem('reviewShown', 'true');
});

// 노출 조건 (5번 클릭 시)
nextBtn.addEventListener('click', () => {
    quizCount++;
    if (quizCount >= 5 && (!localStorage.getItem('reviewShown') || TEST_MODE)) {
        showReviewModal();
    }
});





// =========================
// 스와이퍼
// =========================
const swiper = new Swiper('.swiper', {
    freeMode: true,
    slidesPerView: "auto",
    on: {
        init: function () {
            updateFadeOverlay(this);
        },
        slideChange: function () {
            updateFadeOverlay(this);
        },
        resize: function () {
            updateFadeOverlay(this);
        },
        reachBeginning: function () {
            updateFadeOverlay(this);
        },
        reachEnd: function () {
            updateFadeOverlay(this);
        },
        fromEdge: function () {
            updateFadeOverlay(this);
        },
    },
});

// 스와이퍼 좌우에 페이드효과
function updateFadeOverlay(swiperInstance) {
    const container = swiperInstance.el.closest('.subSort');
    const leftFade = container.querySelector('.swiper-fade-left');
    const rightFade = container.querySelector('.swiper-fade-right');

    if (!leftFade || !rightFade) return;

    if (swiperInstance.isBeginning) {
        leftFade.classList.add('fade-hidden');
    } else {
        leftFade.classList.remove('fade-hidden');
    }

    if (swiperInstance.isEnd) {
        rightFade.classList.add('fade-hidden');
    } else {
        rightFade.classList.remove('fade-hidden');
    }
}

// =========================
// 로고 클릭 이벤트
// =========================
const logo = document.querySelector('.logo');

logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    location.reload();
});

// =========================
// 필터 및 정렬 기능
// =========================
const filterKeys = ['allall', 'whk', 'brd', 'vka', 'gin', 'rum', 'teq', 'lqr', 'trd', 'win', 'vrg', 'cok', 'ofd', 'hbl', 'pls', 'col', 'sur', 'lqg', 'swg', 'wig', 'sss', 'fss', 'str', 'bld', 'shk', 'bnd', 'flt', 'chr', 'lms', 'aps', 'lmw', 'tlp', 'top', 'orsnchr', 'pawnchr', 'lmsnchr', 'olv', 'lim', 'nmc', 'ooo', 'ont', 'sgr', 'grs', 'tri', 'sow', 'ang', 'cam'];

function filterCards(filterClass) {
    document.querySelectorAll('.cardWrap .card').forEach(card => {
        card.classList.remove('hide');
        if (filterClass !== 'allall' && !card.classList.contains(filterClass)) {
            card.classList.add('hide');
        }
    });
}

// =========================
// mainSort li 클릭 이벤트
// =========================
setTimeout(() => {
    document.querySelectorAll('.mainSort li').forEach(mainItem => {
        mainItem.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelectorAll('.mainSort li').forEach(li => li.classList.remove('on'));
            this.classList.add('on');

            // subSort 초기화
            document.querySelectorAll('.subSort .swiper').forEach(swiper => {
                swiper.classList.remove('on');
                swiper.querySelectorAll('.swiper-slide').forEach(slide => slide.classList.remove('on'));
            });

            // 활성화할 targetClass
            const targetClass = Array.from(this.classList).find(cls =>
                ['all', 'base', 'glass', 'method', 'garnish', 'etc'].includes(cls)
            );
            if (!targetClass) return;

            const subSwiper = document.querySelector(`.${targetClass}Sub`);
            if (subSwiper) {
                subSwiper.classList.add('on');
                const firstSlide = subSwiper.querySelector('.swiper-slide');
                if (firstSlide) {
                    firstSlide.classList.add('on');
                    const filterClass = Array.from(firstSlide.classList).find(cls => filterKeys.includes(cls));
                    if (filterClass) filterCards(filterClass);
                }
            }

            const topicMap = {
                base: 'baseTopic',
                glass: 'glassTopic',
                method: 'methodTopic',
                garnish: 'garnishTopic'
            };

            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                const topicItems = card.querySelectorAll('.imgWrap .topic li');
                topicItems.forEach(li => li.classList.remove('on'));

                if (targetClass === 'all') {
                    topicItems.forEach(li => li.classList.add('on'));
                } else if (topicMap[targetClass]) {
                    const matchedTopic = card.querySelector(`.imgWrap .topic li.${topicMap[targetClass]}`);
                    if (matchedTopic) matchedTopic.classList.add('on');
                }
            });
        });
    });

    // =========================
    // 서브 swiper-slide 클릭
    // =========================
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', function () {
            const swiper = this.closest('.swiper');
            if (!swiper) return;

            swiper.querySelectorAll('.swiper-slide').forEach(s => s.classList.remove('on'));
            this.classList.add('on');

            const filterClass = Array.from(this.classList).find(cls => filterKeys.includes(cls));
            if (filterClass) filterCards(filterClass);
        });
    });

    // =========================
    // 검색 기능
    // =========================
    const searchInput = document.querySelector('.searchInput');
    const cards = document.querySelectorAll('.cardWrap .card');
    const closeBtn = document.querySelector('.ic_close');

    function filterCardsBySearch(query) {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            const note = clone.querySelector('.note');
            if (note) note.remove();
            const textWithoutNote = clone.textContent.toLowerCase().trim();
            card.style.display = textWithoutNote.includes(query) ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        filterCardsBySearch(query);
        closeBtn.style.display = query !== '' ? 'block' : 'none';
    });

    closeBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterCardsBySearch('');
        closeBtn.style.display = 'none';
        searchInput.focus();
    });

    // =========================
    // 스크롤 고정 처리
    // =========================
    const sortWrap = document.querySelector('.sortWrap');
    const cardWrap = document.querySelector('.cardWrap');
    const subConTitles = document.querySelectorAll('.subConTitle');
    let lastScrollY = window.scrollY;

    function adjustCardWrapPadding() {
        if (sortWrap && cardWrap) {
            const navHeight = sortWrap.offsetHeight;
            cardWrap.style.paddingTop = `${navHeight}px`;
        }
    }

    const resizeObserver = new ResizeObserver(adjustCardWrapPadding);
    resizeObserver.observe(sortWrap);
    adjustCardWrapPadding();

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;

        if (currentY > lastScrollY + 10) {
            sortWrap.classList.add('scrollHide');
        } else if (currentY < lastScrollY - 2) {
            sortWrap.classList.remove('scrollHide');
        }

        const isScrolled = currentY > 0;
        sortWrap.classList.toggle('scrolled', isScrolled);
        subConTitles.forEach(title => title.classList.toggle('scrolled', isScrolled));

        lastScrollY = currentY;
    });

    const searchWrap = document.querySelector('.searchWrap');
    let lastSearchScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY > lastSearchScrollY + 10) {
            searchWrap.classList.add('scrolled');
        } else if (currentY < lastSearchScrollY - 2) {
            searchWrap.classList.remove('scrolled');
        }
        lastSearchScrollY = currentY;
    });
}, 0);

// =========================
// 공통 DOM
// =========================
const homeWrap = document.querySelector('.homeContents .cardWrap');
const starContents = document.querySelector('.starContents');
const starCardWrap = starContents.querySelector('.cardWrap');
const progressText = document.querySelector('.memorise .memorise-progress');

// =========================
// 암기 진행률
// =========================
function updateProgress() {
    const total = homeWrap.querySelectorAll('.card').length;
    let memorizedCount = 0;

    homeWrap.querySelectorAll('.card').forEach(card => {
        if (card.classList.contains('folded')) memorizedCount++;
    });

    const percent = Math.round((memorizedCount / total) * 100);
    const memoriseWrap = document.querySelector('.memorise');
    const progressBg = document.querySelector('.memorise .progress-bg');

    if (percent === 0) {
        progressText.textContent = '0%';
        memoriseWrap.classList.add('zero');
        memoriseWrap.classList.remove('complete');
        progressBg.style.width = '0%';
    } else if (percent === 100) {
        progressText.textContent = '🎉 암기 완료';
        memoriseWrap.classList.add('complete');
        memoriseWrap.classList.remove('zero');
        progressBg.style.width = '100%';
    } else {
        progressText.textContent = percent + '%';
        memoriseWrap.classList.remove('zero', 'complete');
        progressBg.style.width = percent + '%';
    }
}

// =========================
// 카드 암기 버튼
// =========================
homeWrap.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const completeBtn = card.querySelector('.completeBtn');

    const isFolded = localStorage.getItem(`folded_${id}`) === 'true';
    if (isFolded) {
        card.classList.add('folded');
        completeBtn.classList.add('on');
    }

    completeBtn.addEventListener('click', () => {
        const folded = card.classList.toggle('folded');
        completeBtn.classList.toggle('on', folded);
        localStorage.setItem(`folded_${id}`, folded);
        updateProgress();
    });
});






// =========================
// 즐겨찾기 카드 생성
// =========================
function createStarCard(originCard) {
    const clone = originCard.cloneNode(true);
    clone.classList.remove('folded', 'on');
    clone.querySelector('.completeBtn')?.classList.remove('on');
    clone.querySelector('.starBtn')?.classList.add('on');
    clone.classList.add('star-card');
    return clone;
}

// 즐겨찾기 저장 / 불러오기
function saveStarredCards() {
    const starredIds = Array.from(homeWrap.querySelectorAll('.card.on'))
        .map(card => card.dataset.id);
    localStorage.setItem('starredCards', JSON.stringify(starredIds));
}

function updateNoStarredCard() {
    const noStarredCard = document.querySelector('.noStarredCard');
    if (!noStarredCard) return;

    if (starCardWrap.children.length > 0) {
        noStarredCard.classList.add('hidden');
    } else {
        noStarredCard.classList.remove('hidden');
    }
}

// ⭐ 최종 단일 선언
function loadStarredCards() {
    const starredIds = JSON.parse(localStorage.getItem('starredCards') || '[]');

    starredIds.forEach(id => {
        const originalCard = homeWrap.querySelector(`.card[data-id="${id}"]`);
        if (!originalCard) return;

        originalCard.classList.add('on');
        originalCard.querySelector('.starBtn')?.classList.add('on');

        if (!starCardWrap.querySelector(`[data-id="${id}"]`)) {
            const clone = createStarCard(originalCard);
            starCardWrap.appendChild(clone);
        }
    });

    updateNoStarredCard(); // ✅ 새로고침 대응
}

// 즐겨찾기 버튼 클릭
document.addEventListener('click', e => {
    const starBtn = e.target.closest('.starBtn');
    if (!starBtn) return;

    const card = starBtn.closest('.card');
    if (!card || !homeWrap.contains(card)) return;

    const cardId = card.dataset.id;

    card.classList.toggle('on');
    starBtn.classList.toggle('on');

    if (card.classList.contains('on')) {
        if (!starCardWrap.querySelector(`[data-id="${cardId}"]`)) {
            const clone = createStarCard(card);
            starCardWrap.appendChild(clone);
        }
    } else {
        const target = starCardWrap.querySelector(`[data-id="${cardId}"]`);
        if (target) target.remove();
    }

    saveStarredCards();
    updateNoStarredCard();
});




/* =========================
   퀴즈 모드
========================= */
const quizWrap = document.querySelector('.quizContents .cardWrap');
const quizNavBtn = document.querySelector('.quizNav');
let quizPool = []; // 남은 카드 풀
let currentQuizCard = null;

// quizNav 클릭 시 초기화
quizNavBtn.addEventListener('click', () => {
    // 기존 카드 제거
    quizWrap.innerHTML = '';

    // homeNav의 카드 중에서 quiz용 풀 생성
    quizPool = Array.from(document.querySelectorAll('.homeContents .card'));

    showNextQuizCard();
});

// 랜덤 카드 표시 함수
function showNextQuizCard() {
    if (quizPool.length === 0) return;

    // 랜덤 인덱스 선택
    const randIndex = Math.floor(Math.random() * quizPool.length);
    const selectedCard = quizPool[randIndex];

    // 현재 카드 업데이트
    currentQuizCard = selectedCard.cloneNode(true);

    // completeBtn 제거 또는 숨김
    const completeBtn = currentQuizCard.querySelector('.completeBtn');
    if (completeBtn) {
        completeBtn.classList.remove('on'); // on 제거
        completeBtn.style.display = 'none';  // 버튼 숨김
    }

    // folded 클래스 제거
    currentQuizCard.classList.remove('folded', 'on');

    // 기존 카드 제거 후 붙이기
    quizWrap.innerHTML = '';
    quizWrap.appendChild(currentQuizCard);

    // topic과 recipeWrap에 quizHide 클래스 추가
    currentQuizCard.querySelectorAll('.imgWrap .topic li, .recipeWrap *').forEach(el => {
        el.classList.add('quizHide');
    });
}


// =========================
// 퀴즈 버튼 연결
// =========================
const quizShowAnswerBtn = document.querySelector('.answerBtn');
const quizNextBtn = document.querySelector('.nextBtn');

// 정답보기 버튼 클릭
quizShowAnswerBtn.addEventListener('click', () => {
    if (!currentQuizCard) return;
    currentQuizCard.querySelectorAll('.imgWrap .topic li, .recipeWrap *').forEach(el => {
        el.classList.add('show'); // quizHide는 그대로 두고 show 클래스 추가
    });
});

// 다음문제 버튼 클릭
quizNextBtn.addEventListener('click', () => {
    showNextQuizCard();
});





// =========================
// 하단 네비게이션
// =========================
const contents = document.querySelectorAll('.contents');
const navBtns = document.querySelectorAll('.navBtn');
const navWrap = document.querySelector('.btmNav');

let lastScroll = 0;

// ⭐ mainSort li.all 활성화 함수
function activateMainSortAll() {
    document.querySelectorAll('.mainSort li').forEach(li => li.classList.remove('on'));
    document.querySelector('.mainSort li.all')?.classList.add('on');

    document.querySelectorAll('.subSort .swiper').forEach(swiper => {
        swiper.classList.remove('on');
        swiper.querySelectorAll('.swiper-slide').forEach(slide => slide.classList.remove('on'));
    });

    const allSub = document.querySelector('.allSub');
    if (allSub) {
        allSub.classList.add('on');
        const firstSlide = allSub.querySelector('.swiper-slide');
        if (firstSlide) {
            firstSlide.classList.add('on');
            const filterClass = Array.from(firstSlide.classList).find(cls => filterKeys.includes(cls));
            if (filterClass) filterCards(filterClass);
        }
    }

    document.querySelectorAll('.card').forEach(card => {
        const topicItems = card.querySelectorAll('.imgWrap .topic li');
        topicItems.forEach(li => li.classList.add('on'));
    });
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        contents.forEach(c => c.classList.remove('on'));
        navBtns.forEach(n => n.classList.remove('on'));

        if (btn.classList.contains('homeNav')) {
            document.querySelector('.homeContents').classList.add('on');
        }
        if (btn.classList.contains('starNav')) {
            document.querySelector('.starContents').classList.add('on');
            activateMainSortAll(); // ⭐ 추가
        }
        if (btn.classList.contains('quizNav')) {
            document.querySelector('.quizContents').classList.add('on');
            activateMainSortAll(); // ⭐ 추가
        }

        btn.classList.add('on');
    });
});

// =========================
// 스크롤로 네비게이션 숨기기/보이기
// =========================
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScroll) {
        navWrap.classList.add('hide');
    } else {
        navWrap.classList.remove('hide');
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// =========================
// 초기 실행
// =========================
loadStarredCards();
updateProgress();
