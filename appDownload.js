// ==========================
// 다운로드 버튼 처리
// ==========================
const downloadBtns = document.querySelectorAll(".downloadBtn");

downloadBtns.forEach(btn => {
  btn.addEventListener("click", function (e) {

    e.preventDefault(); // 링크 기본 이동 막기

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      window.open("https://play.google.com/store/apps/details?id=com.yolmoococktails.app", "_blank");

    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      alert("iOS 앱은 현재 준비중입니다.");

    } else {
      window.open("https://play.google.com/store/apps/details?id=com.yolmoococktails.app", "_blank");
    }

  });
});


// ==========================
// 팝업 처리
// ==========================
const popup = document.querySelector('.appPopup');

// 퀴즈 / 즐겨찾기 클릭
document.querySelector('.quizNav').addEventListener('click', ()=>{
    popup.style.display = 'flex';
});

document.querySelector('.starNav').addEventListener('click', ()=>{
    popup.style.display = 'flex';
});

// 닫기 버튼
document.querySelector('.closePopup').addEventListener('click', ()=>{
    popup.style.display = 'none';
    location.reload();
});

// 딤 클릭
popup.addEventListener('click', (e)=>{
    if(e.target === popup){
        popup.style.display = 'none';
        location.reload();
    }
});