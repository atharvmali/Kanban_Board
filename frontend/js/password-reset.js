const API_BASE_URL =
  window.location.protocol === "file:" ? "http://localhost:5050/api" : `${window.location.origin}/api`;

const forgotForm = document.getElementById("forgotPasswordForm");
const resetForm = document.getElementById("resetPasswordForm");
const message = document.getElementById("message");

function showMessage(text, isError = true) {
  if (!message) {
    return;
  }

  message.textContent = text;
  message.style.color = isError ? "#b91c1c" : "#166534";
}

if (forgotForm) {
  forgotForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    if (!email) {
      showMessage("Email is required.");
      return;
    }

    try {
      showMessage("Sending reset link...", false);

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to request password reset");
      }

      showMessage(data.message, false);
    } catch (error) {
      showMessage(error.message);
    }
  });
}

if (resetForm) {
  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = new URLSearchParams(window.location.search).get("token");
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!token) {
      showMessage("Reset token is missing in URL.");
      return;
    }

    if (!password || !confirmPassword) {
      showMessage("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    try {
      showMessage("Updating password...", false);

      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      showMessage("Password updated. Redirecting to login...", false);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } catch (error) {
      showMessage(error.message);
    }
  });
}
