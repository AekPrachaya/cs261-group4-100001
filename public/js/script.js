function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password img");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.src = "../img/eye open visible show.svg"; // เปลี่ยนเป็นไอค่อน "มองเห็นได้"
        toggleIcon.alt = "Hide Password";
    } else {
        passwordInput.type = "password";
        toggleIcon.src = "../img/eye closed hidden.svg"; // เปลี่ยนเป็นไอค่อน "ซ่อนรหัสผ่าน"
        toggleIcon.alt = "Show Password";
    }
}

//ส่วนปุ่มเปลี่ยนภาษา
// location.hash = "th"
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
        changeLoginLang();
        languageButton.textContent = "TH";
    }
    else if (location.hash == "#th") {
        changeLoginLang(language.th);
        languageButton.textContent = "EN";
    }
}

function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log("Logging in...");

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Application-Key': ' ',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('message');
        console.log(data.message);

        messageElement.classList.remove('success', 'fail');

        if (data.message.toLowerCase().includes("success")) {
            messageElement.innerText = 'Success !';
            messageElement.classList.add('success');
        } else {
            messageElement.innerText = 'Invalid Username or Password !';
            messageElement.classList.add('fail');
        }

        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        const messageElement = document.getElementById('message');
        messageElement.innerText = 'Invalid Username or Password !';
        messageElement.classList.remove('success');
        messageElement.classList.add('fail');
    });
}
