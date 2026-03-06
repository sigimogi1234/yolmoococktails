const downloadBtns = document.querySelectorAll(".downloadBtn");

downloadBtns.forEach(btn => {
  btn.addEventListener("click", function () {

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      // 새 창에서 구글 플레이 열기
      window.open("https://play.google.com/store/apps/details?id=com.yolmoococktails.app", "_blank");

    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      alert("iOS 앱은 현재 준비중입니다.");

    } else {
      // PC나 기타 브라우저에서 새 창
      window.open("https://play.google.com/store/apps/details?id=com.yolmoococktails.app", "_blank");
    }

  });
});






const popup = document.querySelector('.appPopup');

// 퀴즈/즐겨찾기 클릭 → 팝업 띄우기
document.querySelector('.quizNav').addEventListener('click', ()=>{
    popup.style.display = 'flex';
});

document.querySelector('.starNav').addEventListener('click', ()=>{
    popup.style.display = 'flex';
});

// 닫기 버튼 클릭 → 팝업 닫기 + 페이지 새로고침
document.querySelector('.closePopup').addEventListener('click', ()=>{
    popup.style.display = 'none';
    location.reload(); // 페이지 새로고침
});

// 배경 딤 영역 클릭 → 팝업 닫기 + 페이지 새로고침
popup.addEventListener('click', (e)=>{
    if(e.target === popup){  // 팝업 박스가 아닌 배경 클릭 시
        popup.style.display = 'none';
        location.reload(); // 페이지 새로고침
    }
});