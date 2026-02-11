// ================= API CONFIG =================
// Auto switch local / live
const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://ai-test-generator-ll6t.onrender.com/api";


// Authentication Functions
async function signin() {
    let email = document.getElementById("signinEmail").value.trim();
    let password = document.getElementById("signinPassword").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));

            document.getElementById("signinEmail").value = "";
            document.getElementById("signinPassword").value = "";

            const btn = document.getElementById("generateBtn");
            if (btn) btn.disabled = false;

            const generator = document.getElementById("generator");
            if (generator) {
                generator.style.pointerEvents = "auto";
                generator.style.opacity = "1";
            }

            alert("Login successful! Welcome, " + (data.user.name || data.user.email));
            closeAuthModal();
            updateNavForAuth();
        } else {
            alert(data.error || "Login failed");
        }

    } catch (err) {
        alert("Server error. Backend not reachable.");
    }
}


async function signup() {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            alert("Signup successful!");
            closeAuthModal();
            updateNavForAuth();
        } else {
            alert(data.error || "Signup failed");
        }

    } catch (err) {
        alert("Server error. Backend not reachable.");
    }
}


// Generate Test
async function generateTest() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Login first");
        openAuthModal('signin');
        return;
    }

    const testData = {
        title: document.getElementById('testTitle').value,
        count: parseInt(document.getElementById('numQuestions').value),
        difficulty: document.getElementById('difficulty').value,
        topic: document.getElementById('topics').value
    };

    try {
        const response = await fetch(`${API_BASE}/tests/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Test generation failed.");
            return;
        }

        alert("Test Generated Successfully!");

    } catch (error) {
        alert("Could not reach backend.");
    }
}


// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    updateNavForAuth();
    alert("Logged out successfully!");
}
