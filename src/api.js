const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const STORAGE_KEY = "edtech-users";
let demoUsers = [];

function readStoredUsers() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const users = window.localStorage.getItem(STORAGE_KEY);
      if (users) {
        const parsedUsers = JSON.parse(users);
        demoUsers = parsedUsers;
        return parsedUsers;
      }
    } catch (error) {
      // Ignore storage errors and fall back to the in-memory list.
    }
  }

  return demoUsers;
}

function saveStoredUser(user) {
  const users = readStoredUsers();
  const nextUsers = [...users, user];
  demoUsers = nextUsers;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers));
    } catch (error) {
      // Ignore storage errors and keep the in-memory fallback active.
    }
  }
}

export async function authenticateUser({ endpoint, payload }) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    // Fall back to the local demo experience when the Spring Boot service is not running.
  }

  if (endpoint.includes("/register")) {
    const user = {
      fullName: payload.fullName || payload.email,
      email: payload.email,
      password: payload.password,
    };

    saveStoredUser(user);
    return user;
  }

  if (endpoint.includes("/login")) {
    const storedUser = readStoredUsers().find(
      (user) =>
        user.email === payload.email && user.password === payload.password,
    );
    return storedUser ? { ...storedUser } : null;
  }

  return null;
}
