async function getUserInformation() {
    const userInfo = await fetch("/api/session", {
        headers: {},
    });
    return userInfo.json(); // return promise ของข้อมูล session ใน รูปแบบ JSON
}

async function updateUserInfomation() {
    //ใช้แสดงข้อมูล user ที่กำลังอยู่ใน session
    const displayName = document.querySelector("#user-name"); //เลือก element ที่ใช้แสดงชื่อ
    const displayUsername = document.querySelector("#user-username"); //เลือก element ที่ใช้แสดง username
    const displayFaculty = document.querySelector("#user-faculty"); //เลือก element ที่ใช้แสดงคณะ
    const displayDepartment = document.querySelector("#user-department"); //เลือก element ที่ใช้แสดงสาขา
    const displayEmail = document.querySelector("#user-email"); //เลือก element ที่ใช้แสดง email
    try {
        // ถ้า response ข้อมูลผู้ใช้ถูกต้อง ให้แสดงข้อมูลบนหน้าเว็บ
        const userInfo = await getUserInformation();
        displayName.textContent = userInfo.displayname_th;
        displayUsername.textContent = userInfo.username;
        displayFaculty.textContent = userInfo.faculty;
        displayDepartment.textContent = userInfo.department;
        displayEmail.textContent = userInfo.email;
    } catch (e) {
        // ถ้า response ผิดพลาดหรือว่าง ให้แสดงข้อความ "ไม่สามารถแสดงผลข้อมุล"
        console.error(e);
        displayName.textContent = "ไม่สามารถแสดงผลข้อมุล";
        displayUsername.textContent = "ไม่สามารถแสดงผลข้อมุล";
        displayFaculty.textContent = "ไม่สามารถแสดงผลข้อมุล";
        displayDepartment.textContent = "ไม่สามารถแสดงผลข้อมุล";
        displayEmail.textContent = "ไม่สามารถแสดงผลข้อมุล";
    }
}

// เรียกฟังก์ชัน updateUserInformation เมื่อโหลดหน้าเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", updateUserInfomation);

// Elements ใช้เพื่อดูสำหรับตกแต่งCss
const gearIcon = document.getElementById("gearIcon");
const popupMenu = document.getElementById("popupMenu");

// เปิด/ปิดป๊อปอัพเมื่อกดไอคอนฟันเฟือง
gearIcon.addEventListener("click", () => {
    popupMenu.classList.toggle("hidden");
});

// ตัวอย่างการใช้งานปุ่ม Profile และ Logout
const profileButton = document.getElementById("profileButton");
const logoutButton = document.getElementById("logoutButton");

profileButton.addEventListener("click", () => {
    alert("คุณเลือก Profile");
});

logoutButton.addEventListener("click", () => {
    alert("คุณเลือก Logout");
});
