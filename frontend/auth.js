const API_BASE_URL =
  window.location.protocol === "file:" ? "http://localhost:5050/api" : `${window.location.origin}/api`;

const form = document.getElementById("loginForm") || document.getElementById("signupForm");
const message = document.getElementById("message");

const TOKEN_KEY = "kanban_token";
const USER_KEY = "kanban_user";

function showMessage(text) {
  message.textContent = text;
}

if (localStorage.getItem(TOKEN_KEY) && window.location.pathname.endsWith("login.html")) {
  window.location.href = "index.html";
}

if (localStorage.getItem(TOKEN_KEY) && window.location.pathname.endsWith("signup.html")) {
  window.location.href = "index.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isLogin = form.id === "loginForm";
  const endpoint = isLogin ? "/auth/login" : "/auth/register";

  const payload = isLogin
    ? {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
      }
    : {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
      };

  if (!payload.email || !payload.password || (!isLogin && !payload.name)) {
    showMessage("All fields are required.");
    return;
  }

  try {
    showMessage("Please wait...");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    window.location.href = "index.html";
  } catch (error) {
    showMessage(error.message);
  }
});
