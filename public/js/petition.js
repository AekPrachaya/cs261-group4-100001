//ส่วนปุ่มเปลี่ยนภาษา
const languageButton = document.querySelector(".language-switch");

function switchLanguage() {// เปลี่่ยน hash ที่ url เพื่อใช้กำหนดภาษา
    if(location.hash === "#th"){
        location.hash = "en";
        location.reload();
    }else if(location.hash ==="#en"){
        location.hash = "th";
        location.reload();
    }else{
        location.hash = "en";
        location.reload();
    }
}

languageButton.addEventListener("click", switchLanguage)//เพิ่ม event ที่ปุ่มเปลี่ยนภาษาด้วย function switchlanguage()

//หลัง reload ให้เช็คค่า hash และเปลี่ยนภาษาตาม
if (location.hash) {
    if (location.hash == "#en") {
        changePetitionLang();
        changeSidebarLang();
        languageButton.textContent = "TH";
    }
    else if (location.hash == "#th") {
        changePetitionLang(language.th);
        changeSidebarLang(language.th);
        languageButton.textContent = "EN";
    }
}