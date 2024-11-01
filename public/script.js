function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password img');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'img/eye closed hidden.png';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'img/eye closed hidden.png';
    }
}
