const form = document.querySelector("#login");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

async function login(username, password) {
    //ใช้ในการ login เข้า session
    const loginData = await fetch("/api/login", {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });
    return loginData;
}

function showCustomAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");

    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");
}

function closeCustomAlert() {
    const alertBox = document.getElementById("custom-alert");
    alertBox.classList.add("hidden");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
        //เช็ค username ว่าง
        showCustomAlert("Please enter your username.");
        usernameInput.focus();
        return;
    }

    if (!password) {
        //เช็ค password ว่าง
        showCustomAlert("Please enter your password.");
        passwordInput.focus();
        return;
    }

    if (!(username.length === 10)) {
        //เช็ค username ต้องมี 10 หลัก
        showCustomAlert("Your username or password is not correct.");
        usernameInput.focus();
        return;
    }

    if (!(password.length === 13)) {
        //เช็ค password ต้องมี 13 หลัก
        showCustomAlert("Your username or password is not correct.");
        passwordInput.focus();
        return;
    }

    const result = await login(username, password); // login
    console.log(result);

    if (!result.ok) {
        // ถ้า promise reject ให้ขึ้นเติม
        return showCustomAlert("Login failed. Invalid credentials.");
    }

    window.location.href = result.url;
    // const json = await result.json(); // แปลง promise เป็น JSON
    // console.log(json);
    // if (json) {
    //     localStorage.setItem("user", JSON.stringify(json.user));// set ข้อมูล user ไว้ที่
    //     window.location.href = json.redirectTo; //redirect ไปหน้า profile
    // }
});
