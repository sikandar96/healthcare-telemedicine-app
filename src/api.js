const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9008/api";
const TOKEN_KEY = "healthcare-telemedicine-token";
const USER_KEY = "healthcare-telemedicine-user";

export function getToken() {
  return typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
}

function saveSession(auth) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, auth.token);
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify({ roles: auth.roles || [], username: auth.username || null }),
  );
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload?.data ?? payload;
}

export async function login(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  // Persist the JWT before calling the protected current-user endpoint.
  // Previously /auth/me ran while no Authorization header was available.
  saveSession({ ...data, username });
  const me = await request("/auth/me", { method: "GET" });
  const auth = { ...data, username: me };
  saveSession(auth);
  return auth;
}

export async function register(username, password, role = "PATIENT", email = "", phone = "") {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password, role, email, phone }),
  });
  const auth = { ...data, username };
  saveSession(auth);
  return auth;
}

export async function requestPasswordReset(identifier) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function resetPassword(token, password) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export const api = {
  me: () => request("/auth/me"),
  doctors: () => request("/doctors/available"),
  bookConsultation: (payload) => request("/consultations/book", { method: "POST", body: JSON.stringify(payload) }),
  myConsultations: () => request("/consultations/my"),
  updateConsultation: (id, payload) => request(`/consultations/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
  pharmacies: () => request("/pharmacies/available"),
  orderMedicine: (payload) => request("/pharmacies/medicine-orders", { method: "POST", body: JSON.stringify(payload) }),
  myOrders: () => request("/pharmacies/medicine-orders"),
  reminders: () => request("/reminders/list"),
  createReminder: (payload) => request("/reminders/create", { method: "POST", body: JSON.stringify(payload) }),
  completeReminder: (id) => request(`/reminders/${id}/complete`, { method: "PATCH" }),
  campaigns: () => request("/platform/campaigns/active"),
  appointments: () => request("/platform/appointments/mine"),
  clinicalRecords: () => request("/platform/clinical-records/mine"),
  prescriptions: () => request("/platform/prescriptions/mine"),
  payments: () => request("/platform/payments/mine"),
  notifications: () => request("/platform/notifications"),
  markNotificationRead: (id) => request(`/platform/notifications/${id}/read`, { method: "PATCH" }),
  consents: () => request("/platform/consents"),
  grantConsent: (payload) => request("/platform/consents", { method: "POST", body: JSON.stringify(payload) }),
};

export { API_BASE_URL };
