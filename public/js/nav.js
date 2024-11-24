//ใช้รับข้อมูล user ใน session
async function getUserInformation() {
    const userInfo = await fetch("/api/session", {
        headers: {
        }
    });
    return userInfo.json() // return promise ของข้อมูล session ใน รูปแบบ JSON
}

// แสดงชื่อ user ข้างใต้ sidebar 
async function displayUserInfomation() {
    const name = document.querySelector("#user-info-name span");
    const id = document.querySelector("#user-info-id")

    try {
        const info = await getUserInformation(); // เก็บข้อมูล user ที่ดึงมาจาก api/session

        name.textContent = info["displayname_th"];
        id.textContent = info["username"];
    } catch (e) {
        console.error(e);
        name.textContent = "เกิดข้อผิดพลาด";
        id.textContent = "เกิดข้อผิดพลาด";
    }
}


document.addEventListener("DOMContentLoaded", displayUserInfomation);




const profileBtn = document.querySelector("#pop-up-profile"); // ปุ่ม pop-up profile
const logoutBtn = document.querySelector("#pop-up-logout"); // ปุ่ม pop-up logout
const iconBtn = document.querySelector("#pop-up-icon");// ปุ่ม icon
const popUp = document.querySelector(".pop-up"); // div ของ pop up

iconBtn.addEventListener('click', () => { // function แสดง pop up หากกดที่ไอคอน   
    iconBtn.classList.toggle("pop-up-icon-spin");
    if (popUp.style.display === "flex") {
        popUp.style.display = "none";
    } else {
        popUp.style.display = "flex"
    }
})



profileBtn.addEventListener('click', () => { // function เมื่อกดที่ปุ่ม profile ให้ส่งไปที่หน้า /profile
    window.location.href = "/profile";
})

logoutBtn.addEventListener('click', async function () {
    const logoutData = await fetch("/api/logout");

    window.location.href = logoutData.url;

})


