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