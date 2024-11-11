document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".login-form form");
    const usernameInput = form.querySelector("input[aria-label='Username']");
    const passwordInput = form.querySelector("input[aria-label='Password']");

    form.addEventListener("submit", async function(event) {
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
        const result = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (!result.ok) {
            return showCustomAlert("Login failed. Invalid credentials.");
        }

        const json = await result.json();
        if (json) {
            localStorage.setItem("user", JSON.stringify(json.user));
            window.location.href = json.redirectTo;
        }
        // }).then((data) => {
        //     if (data.status === 200) {
        //         showCustomAlert("Login successful!");
        //     } else {
        //         showCustomAlert("Login failed. Invalid credentials.");
        //     }
        // })
        //     .catch((error) => {
        //         console.error("Error:", error);
        //         showCustomAlert("An error occurred. Please try again.");
        //     });
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
