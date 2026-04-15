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

    // ⭐ 여기 추가
    const id = clone.dataset.id;
    const input = clone.querySelector('.noteInput');

    if (input) {
        const saved = localStorage.getItem(`note_${id}`);
        if (saved) {
            input.value = saved;
            autoResizeTextarea(input); // 🔥 핵심
        }
    }

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





// =========================
// 퀴즈 시작 버튼
// =========================
const quizStartBtn = document.querySelector('.quizStartBtn');
const quizStartWrap = document.querySelector('.quizStartWrap');
const cardQuizWrap = document.querySelector('.cardQuizWrap');

quizStartBtn.addEventListener('click', () => {
    quizStartWrap.classList.remove('on');
    cardQuizWrap.classList.add('on');

    // ✅ 상태 초기화
    totalQuizCount = quizNum;
    solvedCount = 0;
    correctCount = 0;
    wrongAnswersList = [];

    timeLeft = quizTime;

    updateHUD();
    startTimer();

    showNextQuizCard();
});
// =========================
// 퀴즈 설정 값
// =========================
let quizNum = 10; // 기본 문제 수
let quizTime = 60;  // 기본 시간(초)

// 요소 가져오기
const quizNumBtn = document.querySelector('.quizNumBtn');
const quizTimeBtn = document.querySelector('.quizTimeBtn');

const quizNumText = quizNumBtn.querySelector('p');
const quizTimeText = quizTimeBtn.querySelector('p');

const numMinus = quizNumBtn.querySelector('.minusIcon');
const numPlus = quizNumBtn.querySelector('.plusIcon');

const timeMinus = quizTimeBtn.querySelector('.minusIcon');
const timePlus = quizTimeBtn.querySelector('.plusIcon');


// =========================
// 버튼 상태 업데이트 함수
// =========================
function updateBtnState() {
    // 문제 수 버튼
    numMinus.style.opacity = quizNum <= 5 ? 0.3 : 1;
    numPlus.style.opacity = quizNum >= 40 ? 0.3 : 1;

    // 클릭 막기까지 적용 (선택사항 but 추천)
    numMinus.style.pointerEvents = quizNum <= 5 ? 'none' : 'auto';
    numPlus.style.pointerEvents = quizNum >= 40 ? 'none' : 'auto';

    // 시간 버튼
    timeMinus.style.opacity = quizTime <= 10 ? 0.3 : 1;
    timePlus.style.opacity = quizTime >= 100 ? 0.3 : 1;

    timeMinus.style.pointerEvents = quizTime <= 10 ? 'none' : 'auto';
    timePlus.style.pointerEvents = quizTime >= 100 ? 'none' : 'auto';
}


// =========================
// 문제 수 조절 (5 ~ 40)
// =========================
numMinus.addEventListener('click', () => {
    if (quizNum > 5) {
        quizNum -= 5;
        quizNumText.textContent = `총 ${quizNum}문제`;
        updateBtnState();
        saveQuizSettings();
    }
});

numPlus.addEventListener('click', () => {
    if (quizNum < 40) {
        quizNum += 5;
        quizNumText.textContent = `총 ${quizNum}문제`;
        updateBtnState();
        saveQuizSettings();
    }
});


// =========================
// 시간 조절 (10 ~ 100초)
// =========================
timeMinus.addEventListener('click', () => {
    if (quizTime > 10) {
        quizTime -= 10;
        quizTimeText.textContent = `제한시간 ${quizTime}초`;
        updateBtnState();
        saveQuizSettings();
    }
});

timePlus.addEventListener('click', () => {
    if (quizTime < 100) {
        quizTime += 10;
        quizTimeText.textContent = `제한시간 ${quizTime}초`;
        updateBtnState();
        saveQuizSettings();
    }
});

function saveQuizSettings() {
    localStorage.setItem('quizNum', quizNum);
    localStorage.setItem('quizTime', quizTime);
}
function loadQuizSettings() {
    const savedNum = localStorage.getItem('quizNum');
    const savedTime = localStorage.getItem('quizTime');

    if (savedNum !== null) quizNum = parseInt(savedNum);
    if (savedTime !== null) quizTime = parseInt(savedTime);

    quizNumText.textContent = `총 ${quizNum}문제`;
    quizTimeText.textContent = `제한시간 ${quizTime}초`;

    updateBtnState();
}

loadQuizSettings();


// =========================
// HUD + 타이머 함수 (새로 추가)
// =========================
function updateHUD() {
    document.querySelector('.quizNumCount').innerText = `${solvedCount + 1}/${totalQuizCount}`;

    const percent = (solvedCount / totalQuizCount) * 100;
    document.querySelector('.progress').style.width = `${percent}%`;

    document.querySelector('.timeText').innerText = `${timeLeft}초`;
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateHUD();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

// =========================
// 초기 상태 적용 (필수)
// =========================
updateBtnState();



// =========================
// 🔥 추가 전역 상태
// =========================
let totalQuizCount = 0;
let solvedCount = 0;
let correctCount = 0;

let timerInterval = null;
let timeLeft = 0;

let wrongAnswersList = [];
// =========================
// 퀴즈 전역 변수
// =========================
let quizPool = []; 
let currentQuizCard = null;
let currentQuizMode = ""; 
let selectedOption = null; // 사용자가 선택한 정답 텍스트 저장

const quizWrap = document.querySelector('.quizContents .cardWrap');
const quizOptionsUl = document.querySelector('.quiz-options');
const quizShowAnswerBtn = document.querySelector('.answerBtn');
const quizNextBtn = document.querySelector('.nextBtn');

// =========================
// 퀴즈 핵심 함수
// =========================
function showNextQuizCard() {
    const answerLabel = quizShowAnswerBtn.querySelector('.answerText');
    answerLabel.innerText = "정답 확인";
    quizShowAnswerBtn.classList.remove('correct-btn', 'wrong-btn');
    // 1. 풀 채우기 (무한 루프)
    if (quizPool.length === 0) {
        const originalCards = document.querySelectorAll('.homeContents .card');
        quizPool = Array.from(originalCards);
    }

    // 2. 랜덤 카드 선택
    const randIndex = Math.floor(Math.random() * quizPool.length);
    const selectedCard = quizPool[randIndex];
    currentQuizCard = selectedCard.cloneNode(true);

    // 3. 카드 상태 초기화
    const completeBtn = currentQuizCard.querySelector('.completeBtn');
    if (completeBtn) completeBtn.style.display = 'none';
    currentQuizCard.classList.remove('folded', 'on', 'show-answer');

    quizWrap.innerHTML = '';
    quizWrap.appendChild(currentQuizCard);
    
    // 4. 모드 및 가리기 설정
    setupQuizVisibility();

    // 5. 객관식 보기 리스트 생성
    generateQuizOptions(selectedCard);
}

// 가리기 설정 (토픽은 상시 가림)
function setupQuizVisibility() {
    currentQuizMode = Math.random() < 0.5 ? "content" : "title";

    // 토픽 li는 무조건 가림
    currentQuizCard.querySelectorAll('.topic li').forEach(el => el.classList.add('quizHide'));

    if (currentQuizMode === "content") {
        currentQuizCard.querySelectorAll('.recipeWrap *').forEach(el => el.classList.add('quizHide'));
    } else {
        currentQuizCard.querySelectorAll('.titleWrap .title, .titleWrap .titleEng').forEach(el => el.classList.add('quizHide'));
    }
}

// =========================
// 퀴즈 핵심 함수
// =========================

// 텍스트 추출용 헬퍼 함수 (줄바꿈 제거 추가)
const getCleanRecipe = (cardElement) => {
    const recipeWrap = cardElement.querySelector('.recipeWrap').cloneNode(true);
    
    // 1. 불필요한 요소 제거 (.hrz, .note)
    recipeWrap.querySelectorAll('.hrz, .note').forEach(el => el.remove());
    
    // 2. innerText로 가져온 후 줄바꿈(\n)을 공백(' ')으로 치환
    // / \n+/g 는 모든 줄바꿈 문자를 찾아서 한 칸의 공백으로 바꾼다는 의미입니다.
    let cleanText = recipeWrap.innerText.trim().replace(/\n+/g, ' ');
    
    return cleanText;
};

// =========================
// 1. 텍스트 추출 함수 통합 (가장 중요!)
// =========================
const getRecipeString = (cardElement) => {
    // 1. 레시피 영역 복제
    const recipeWrap = cardElement.querySelector('.recipeWrap').cloneNode(true);
    
    // 2. 불필요한 요소(.hrz, .note) 제거
    recipeWrap.querySelectorAll('.hrz, .note').forEach(el => el.remove());
    
    // 3. .recipe 하위의 모든 p 태그 수집
    const pTags = Array.from(recipeWrap.querySelectorAll('.recipe li p'));
    
    const clean = (str) =>
        str.replace(/\s+/g, ' ')        // 공백 여러 개 → 1개
        .replace(/(\d)\s+oz/g, '$1oz') // 1 oz → 1oz
        .trim();

    const items = [];

    const ps = Array.from(recipeWrap.querySelectorAll('.recipe li p'));

    for (let i = 0; i < ps.length; i++) {
        const text = ps[i].textContent.trim();

        if (text === "" || text === "-") continue;

        const next = ps[i + 1]?.textContent.trim();

        if (next && (next.includes("oz") || next.includes("ml") || next.includes("dash"))) {
            items.push(clean(`${text} ${next}`));
            i++;
        } else {
            items.push(clean(text));
        }
    }

    return items.join(' / ');
};

// =========================
// 2. 객관식 보기 생성 함수 수정
// =========================
function generateQuizOptions(correctCard) {
    quizOptionsUl.innerHTML = ''; 
    selectedOption = null; 

    const allCards = Array.from(document.querySelectorAll('.homeContents .card'));
    let correctAnswer = "";
    let wrongAnswers = [];

    if (currentQuizMode === "title") {
        correctAnswer = correctCard.querySelector('.title').textContent.trim();
        wrongAnswers = allCards
            .map(c => c.querySelector('.title').textContent.trim())
            .filter(name => name !== correctAnswer);
        quizOptionsUl.classList.remove('recipe-mode');
    } else {
        // ✅ 여기서도 getRecipeString을 사용해야 합니다!
        correctAnswer = getRecipeString(correctCard);
        wrongAnswers = allCards
            .map(c => getRecipeString(c))
            .filter(recipe => recipe !== correctAnswer);
        quizOptionsUl.classList.add('recipe-mode');
    }
    
    const uniqueWrongs = [...new Set(wrongAnswers)].sort(() => 0.5 - Math.random()).slice(0, 3);
    const finalOptions = [correctAnswer, ...uniqueWrongs].sort(() => 0.5 - Math.random());

    finalOptions.forEach(optText => {
        const li = document.createElement('li');
        li.innerText = optText;
        
        if (currentQuizMode === "content") {
            li.style.fontSize = "12px";
            li.style.textAlign = "left";
            li.style.justifyContent = "left";
        }

        li.addEventListener('click', () => {
            if (currentQuizCard.classList.contains('show-answer')) return;
            document.querySelectorAll('.quiz-options li').forEach(el => el.classList.remove('selected'));
            li.classList.add('selected');
            selectedOption = optText;
        });
        quizOptionsUl.appendChild(li);
    });
}

// =========================
// 3. [정답 확인] 클릭 이벤트 (로직 유지)
// =========================
// [정답 확인] 클릭 이벤트
quizShowAnswerBtn.addEventListener('click', () => {
    if (!currentQuizCard || currentQuizCard.classList.contains('show-answer')) return;
    if (!selectedOption) {
        alert("정답을 먼저 선택해주세요!");
        return;
    }

    try {
        // 1. 변수 정의 (이 변수들을 아래에서 사용합니다)
        const normalize = (str) => str.replace(/\s+/g, ' ').trim();
        let correctAnswer = (currentQuizMode === "title") 
            ? currentQuizCard.querySelector('.title').textContent.trim()
            : getRecipeString(currentQuizCard);

        const isCorrect = normalize(selectedOption) === normalize(correctAnswer);

        if (isCorrect) {
            correctCount++;
        } else {
            const title = currentQuizCard.querySelector('.title')?.textContent.trim();
            if (title) wrongAnswersList.push(title);
        }

        // 2. 버튼 상태 업데이트
        const answerLabel = quizShowAnswerBtn.querySelector('.answerText');
        if (isCorrect) {
            answerLabel.innerText = "정답!";
            quizShowAnswerBtn.classList.add('correct-btn');
        } else {
            answerLabel.innerText = "오답";
            quizShowAnswerBtn.classList.add('wrong-btn');
        }

        // 3. 카드 정답 노출
        currentQuizCard.classList.add('show-answer');
        currentQuizCard.querySelectorAll('.quizHide').forEach(el => el.classList.add('show'));

        document.querySelectorAll('.quiz-options li').forEach(li => {
            const liText = li.innerText.trim();
            li.classList.remove('selected'); // 선택 시 생겼던 테두리 제거
            
            if (normalize(liText) === normalize(correctAnswer)) {
                // 진짜 정답인 항목
                li.classList.add('correct'); 
            } else if (normalize(liText) === normalize(selectedOption)) {
                // 내가 골랐는데 틀린 항목
                li.classList.add('wrong');   
            } else {
                // 정답도 아니고 내가 고른 것도 아닌 나머지 항목들 (회색 처리)
                li.style.background = "#f2f2f2";
                li.style.color = "#aaa";
                li.style.borderColor = "#f2f2f2";
            }
        });

    } catch (e) {
        console.error("에러 발생:", e);
    }
});


// [다음 문제] 클릭 시 버튼 텍스트 초기화 필수!
quizNextBtn.addEventListener('click', () => {
    if (!currentQuizCard || !currentQuizCard.classList.contains('show-answer')) {
        alert("정답을 먼저 확인해주세요!");
        return;
    }

    solvedCount++;

    // ✅ 종료 체크
    if (solvedCount >= totalQuizCount) {
        endQuiz();
        return;
    }

    updateHUD();
    showNextQuizCard();

    // 버튼 초기화
    const answerLabel = quizShowAnswerBtn.querySelector('.answerText');
    answerLabel.innerText = "정답 확인";
    quizShowAnswerBtn.classList.remove('correct-btn', 'wrong-btn');

    document.querySelectorAll('.quiz-options li').forEach(li => {
        li.style.background = "";
        li.style.color = "";
        li.style.borderColor = "";
    });
});

// 퀴즈 종료 함수
function endQuiz() {
    clearInterval(timerInterval);

    cardQuizWrap.classList.remove('on');
    document.querySelector('.quizAgainBtnWrap').classList.add('on');

    const percent = Math.round((correctCount / totalQuizCount) * 100);
    document.querySelector('.percentText').innerText = `${percent}% (${correctCount}/${totalQuizCount})`;

    const usedTime = quizTime - timeLeft;
    document.querySelector('.timeSpent .timeText').innerText = `${usedTime}초`;

    document.querySelector('.wrongText').innerText = wrongAnswersList.join(', ') || "없음";
}

// [다시 퀴즈 풀기] 버튼
// document.querySelector('.againBtn').addEventListener('click', () => {
//     document.querySelector('.quizAgainBtnWrap').classList.remove('on');
//     cardQuizWrap.classList.add('on');

//     solvedCount = 0;
//     correctCount = 0;
//     wrongAnswersList = [];
//     timeLeft = quizTime;

//     updateHUD();
//     startTimer();
//     showNextQuizCard();
// });

// 처음으로
document.querySelector('.returnBtn').addEventListener('click', () => {
    document.querySelector('.quizAgainBtnWrap').classList.remove('on');
    quizStartWrap.classList.add('on');
});





// =========================
// [3] 하단 네비게이션 및 초기화
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
            // filterKeys와 filterCards는 기존 전역 함수를 사용한다고 가정
            const filterClass = Array.from(firstSlide.classList).find(cls => typeof filterKeys !== 'undefined' && filterKeys.includes(cls));
            if (filterClass) filterCards(filterClass);
        }
    }

    document.querySelectorAll('.card').forEach(card => {
        const topicItems = card.querySelectorAll('.imgWrap .topic li');
        topicItems.forEach(li => li.classList.add('on'));
    });
}








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
// textarea 자동 높이
// =========================
function autoResizeTextarea(el) {
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
}

// =========================
// 전체 textarea 높이 리프레시
// =========================
function refreshAllTextareaHeight() {
    document.querySelectorAll('.noteInput').forEach(el => {
        autoResizeTextarea(el);
    });
}

// =========================
// 카드별 저장 타이머
// =========================
let saveTimers = {};

// =========================
// 카드 노트 초기화
// =========================
function initNotes() {
    document.querySelectorAll('.card').forEach(card => {
        const id = card.dataset.id;
        const input = card.querySelector('.noteInput');

        if (!input) return;

        const saved = localStorage.getItem(`note_${id}`);
        input.value = saved || "";

        autoResizeTextarea(input);
    });
}

// =========================
// 메모 입력 이벤트
// =========================
document.addEventListener('input', function (e) {
    if (!e.target.classList.contains('noteInput')) return;

    const card = e.target.closest('.card');
    if (!card) return;

    const id = card.dataset.id;
    const value = e.target.value;

    const status = card.querySelector('.noteStatus');
    if (!status) return;

    // 저장
    localStorage.setItem(`note_${id}`, value);

    // 높이
    autoResizeTextarea(e.target);

    // 🔥 카드 동기화 + 높이 핵심 해결
    document.querySelectorAll(`.card[data-id="${id}"]`).forEach(c => {
        const input = c.querySelector('.noteInput');
        if (input && input !== e.target) {
            input.value = value;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    autoResizeTextarea(input);
                });
            });
        }
    });

    // =========================
    // 상태 UI
    // =========================
    status.textContent = "자동 저장중...";
    status.classList.add('show');

    clearTimeout(saveTimers[id]);

    saveTimers[id] = setTimeout(() => {
        status.textContent = "✔ 저장됨";
    }, 1000);
});

// =========================
// 포커스 해제 시 상태 숨김
// =========================
document.addEventListener('blur', function (e) {
    if (!e.target.classList.contains('noteInput')) return;

    const card = e.target.closest('.card');
    if (!card) return;

    const status = card.querySelector('.noteStatus');
    if (!status) return;

    status.classList.remove('show');

}, true);

// =========================
// ⭐ 즐겨찾기 카드 생성 (단 하나만 존재)
// =========================
function createStarCard(originCard) {
    const clone = originCard.cloneNode(true);

    clone.classList.remove('folded', 'on');
    clone.querySelector('.completeBtn')?.classList.remove('on');
    clone.querySelector('.starBtn')?.classList.add('on');
    clone.classList.add('star-card');

    const id = clone.dataset.id;
    const input = clone.querySelector('.noteInput');

    if (input) {
        const saved = localStorage.getItem(`note_${id}`);
        input.value = saved || "";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                autoResizeTextarea(input);
            });
        });
    }

    return clone;
}

// =========================
// ⭐ starNav 클릭 시 (중요 수정됨)
// =========================
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        contents.forEach(c => c.classList.remove('on'));
        navBtns.forEach(n => n.classList.remove('on'));

        if (btn.classList.contains('homeNav')) {
            document.querySelector('.homeContents').classList.add('on');
        }

        if (btn.classList.contains('starNav')) {
            document.querySelector('.starContents').classList.add('on');
            activateMainSortAll();

            // 🔥 핵심 수정 (height 포함)
            document.querySelectorAll('.card').forEach(card => {
                const id = card.dataset.id;
                const saved = localStorage.getItem(`note_${id}`);
                const input = card.querySelector('.noteInput');

                if (input) {
                    input.value = saved || "";

                    requestAnimationFrame(() => {
                        autoResizeTextarea(input);
                    });
                }
            });
        }

        if (btn.classList.contains('quizNav')) {
            document.querySelector('.quizContents').classList.add('on');
            activateMainSortAll();
            showNextQuizCard();
        }

        btn.classList.add('on');

        // 🔥 전체 높이 보정
        setTimeout(() => {
            refreshAllTextareaHeight();
        }, 50);
    });
});

// =========================
// 페이지 로드시 높이 보정
// =========================
window.addEventListener('load', () => {
    refreshAllTextareaHeight();
});

// =========================
// 초기 실행
// =========================
loadStarredCards();
updateProgress();
initNotes();