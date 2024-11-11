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
fetch("https://restapi.tu.ac.th/api/v1/auth/Ad/verify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Application-Key": "TU_API_KEY" 
  },
  body: JSON.stringify({ username, password })
})
.then((response) => {
  if (!response.ok) {
    throw new Error("Your username or password is not correct.");
  }
  
  return response.json();
})
.then((data) => {
  console.log("API response:", data);
  if (data.status === true && data.message === "Success") {
    const userData = {
      username: data.username
    };
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(() => {
      showCustomAlert("Login successful!");
      setTimeout(() => {
        window.location.href = "request.html";
      }, 1500);
    })
    .catch(error => {
      console.error("Error:", error);
      showCustomAlert("Failed to save login data.");
    });
  } else {
    showCustomAlert("Login failed. Invalid credentials.");
  }
})
.catch((error) => {
  console.error("Error:", error);
  showCustomAlert("An error occurred. Please try again.");
    });
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
