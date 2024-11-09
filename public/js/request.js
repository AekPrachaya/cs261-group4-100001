const form = document.getElementById('requestForm');
    const fileUpload = document.getElementById('fileUpload');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add form submission logic here
        console.log('Form submitted');
    });

    fileUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        const allowedTypes = ['application/pdf', 'image/png'];
        
        // ตรวจสอบจำนวนไฟล์
        if (files.length > 5) {
            alert('กรุณาอัปโหลดไม่เกิน 5 ไฟล์');
            e.target.value = '';  // รีการเลือกไฟล์
            e.target.nextElementSibling.textContent = 'No file chosen';
            return;
        }
        
        // ตรวจสอบชนิดไฟล์
        for (let file of files) {
            if (!allowedTypes.includes(file.type)) {
                alert('กรุณาเลือกไฟล์ PDF หรือ PNG เท่านั้น');
                e.target.value = '';  // รีการเลือกไฟล์
                e.target.nextElementSibling.textContent = 'No file chosen';
                return;
            }
        }

        // แสดงชื่อไฟล์ทั้งหมด
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        e.target.nextElementSibling.textContent = fileNames;
    });

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
        changeRequestLang();
        changeSidebarLang();
        languageButton.textContent = "TH";
    }
    else if (location.hash == "#th") {
        changeRequestLang(language.th);
        changeSidebarLang(language.th);
        languageButton.textContent = "EN";
    }
}