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
        changeUserProfileLang();
        changeSidebarLang();
        languageButton.textContent = "TH";
    }
    else if (location.hash == "#th") {
        changeUserProfileLang(language.th);
        changeSidebarLang(language.th);
        languageButton.textContent = "EN";
    }
}

// ฟังก์ชันสำหรับดึงสถานะของคำร้องและแสดงในปุ่ม request-1 ถึง request-4 ตามลำดับ
async function fetchRequestStatuses() {
    try {
        // ดึง student_id จาก localStorage
        const studentId = JSON.parse(localStorage.getItem('user')).username;

        // ส่งคำขอไปยัง API เพื่อดึงข้อมูลคำร้องทั้งหมดของ student_id ที่ระบุ
        const response = await fetch('/api/petition/get_all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_id: studentId,
            }),
        });

        // ตรวจสอบสถานะการตอบกลับ
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // แปลงข้อมูล JSON ที่ได้รับเป็นออบเจ็กต์ JavaScript
        const data = await response.json();

        // ตรวจสอบว่า data เป็น array ของคำร้อง
        if (Array.isArray(data.data)) {
            // เลือกคำร้องสูงสุด 4 รายการ
            const petitions = data.data.slice(0, 4);

            // แสดงสถานะในปุ่ม request-1 ถึง request-4 ตามลำดับ
            petitions.forEach((petition, index) => {
                const buttonElement = document.getElementById(`request-${index + 1}`);
                if (buttonElement) {
                    buttonElement.textContent = `สถานะ: ${petition.status}`;
                }
            });

            // ถ้าคำร้องมีไม่ครบ 4 รายการ ให้แสดงข้อความ "คำร้องที่ i" ในปุ่มที่เหลือ
            for (let i = petitions.length; i < 4; i++) {
                const buttonElement = document.getElementById(`request-${i + 1}`);
                if (buttonElement) {
                    buttonElement.textContent = `คำร้องที่ ${i + 1}`;
                }
            }
        } else {
            console.error('No petitions found or incorrect data format');
            for (let i = 1; i <= 4; i++) {
                const buttonElement = document.getElementById(`request-${i}`);
                if (buttonElement) {
                    buttonElement.textContent = `คำร้องที่ ${i}`;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching petition data:', error);
        for (let i = 1; i <= 4; i++) {
            const buttonElement = document.getElementById(`request-${i}`);
            if (buttonElement) {
                buttonElement.textContent = `คำร้องที่ ${i}`;
            }
        }
    }
}

// เรียกฟังก์ชัน fetchRequestStatuses เมื่อโหลดหน้าเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", fetchRequestStatuses);
