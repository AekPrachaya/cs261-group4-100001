document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".login-form form");
  const usernameInput = form.querySelector("input[aria-label='Username']");
  const passwordInput = form.querySelector("input[aria-label='Password']");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
      showCustomAlert("Please enter your username.");
      usernameInput.focus();
      return;
    }

    if (!password) {
      showCustomAlert("Please enter your password.");
      passwordInput.focus();
      return;
    }

    if (!(username.length == 10)) {
      showCustomAlert("Your username or password is not correct.");
      usernameInput.focus();
      return;
    }

    if (!(password.length == 13)) {
      showCustomAlert("Your username or password is not correct.");
      passwordInput.focus();
      return;
    }

    showCustomAlert("Login successful!");
    setTimeout(() => {
      window.location.href = "request.html";
    }, 1500);
  });
});

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
