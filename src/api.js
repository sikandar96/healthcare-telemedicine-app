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

function roleList(value) {
  const roles = value?.roles || value?.authorities || value?.role || [];
  const list = Array.isArray(roles) ? roles : [roles];
  return list
    .map((role) => typeof role === "string" ? role : role?.name || role?.authority)
    .filter(Boolean);
}

function saveSession(auth) {
  if (typeof window === "undefined" || !auth?.token) return;
  window.localStorage.setItem(TOKEN_KEY, auth.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify({
    ...auth,
    roles: roleList(auth),
    username: auth.username || null,
  }));
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  let payload = null;
  try { payload = await response.json(); } catch { payload = null; }
  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload?.data ?? payload;
}

function authFromResponse(data, identity, fallbackRoles = [], fullName = "") {
  return {
    ...(data || {}),
    username: data?.username || identity,
    fullName: data?.fullName || data?.name || fullName || null,
    identifier: data?.identifier || identity,
    roles: roleList(data).length ? roleList(data) : fallbackRoles,
  };
}

export async function login(identifier, password) {
  const data = await request("/auth/login", {
    method: "POST",
    // `username` remains for backward compatibility with the current backend;
    // `identifier` lets the backend resolve either email or mobile number.
    body: JSON.stringify({ identifier, username: identifier, password }),
  });
  const auth = authFromResponse(data, identifier);
  saveSession(auth);
  // /auth/me returns only the authenticated username in the current backend.
  // Keep roles from the JWT response and use /me only to confirm the identity.
  try {
    const currentUsername = await request("/auth/me");
    if (typeof currentUsername === "string") auth.username = currentUsername;
  } catch { /* login is already valid; do not discard the session */ }
  saveSession(auth);
  return auth;
}

export async function register(fullName, password, role = "PATIENT", email = "", phone = "") {
  const data = await request("/auth/register", {
    method: "POST",
    // `username` remains for backward compatibility; new backends should persist
    // `fullName` as the user's display name and use email/phone as identifiers.
    body: JSON.stringify({ fullName, username: fullName, password, role, email, phone }),
  });
  const auth = authFromResponse(data, fullName, [String(role).startsWith("ROLE_") ? role : `ROLE_${role}`], fullName);
  saveSession(auth);
  return auth;
}

export function requestPasswordReset(identifier) {
  return request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ identifier }) });
}
export function requestPasswordOtp(identifier, channel = "email") {
  return request("/auth/request-otp", { method: "POST", body: JSON.stringify({ identifier, channel }) });
}
export function verifyPasswordOtp(identifier, otp) {
  return request("/auth/verify-otp", { method: "POST", body: JSON.stringify({ identifier, otp }) });
}
export function resetPassword(token, password) {
  return request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
}

export const api = {
  me: () => request("/auth/me"),
  updateRoles: (username, roles) => request(`/auth/users/${encodeURIComponent(username)}/roles`, { method: "PUT", body: JSON.stringify({ roles }) }),

  doctors: () => request("/doctors/available"),
  registerDoctor: (payload) => request("/doctors/register", { method: "POST", body: JSON.stringify(payload) }),
  registerDoctorProfile: (payload) => request("/healthcare/doctors", { method: "POST", body: JSON.stringify(payload) }),

  bookConsultation: (payload) => request("/consultations/book", { method: "POST", body: JSON.stringify(payload) }),
  myConsultations: () => request("/consultations/my"),
  updateConsultation: (id, payload) => request(`/consultations/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),

  pharmacies: () => request("/pharmacies/available"),
  addPharmacy: (payload) => request("/pharmacies/add", { method: "POST", body: JSON.stringify(payload) }),
  orderMedicine: (payload) => request("/pharmacies/medicine-orders", { method: "POST", body: JSON.stringify(payload) }),
  myOrders: () => request("/pharmacies/medicine-orders"),

  healthcareDoctors: () => request("/healthcare/doctors"),
  healthcareConsultations: () => request("/healthcare/consultations"),
  healthcarePharmacies: () => request("/healthcare/pharmacies"),
  healthcareOrders: () => request("/healthcare/medicine-orders"),
  healthcarePrograms: () => request("/healthcare/health-programs"),
  revenueSummary: () => request("/healthcare/revenue/summary"),

  reminders: () => request("/healthcare/reminders"),
  createReminder: (payload) => request("/healthcare/reminders", { method: "POST", body: JSON.stringify(payload) }),
  completeReminder: (id) => request(`/healthcare/reminders/${id}/complete`, { method: "PATCH" }),
  remindersLegacy: () => request("/reminders/list"),
  createReminderLegacy: (payload) => request("/reminders/create", { method: "POST", body: JSON.stringify(payload) }),

  campaigns: () => request("/platform/campaigns/active"),
  createCampaign: (payload) => request("/platform/campaigns", { method: "POST", body: JSON.stringify(payload) }),
  appointments: () => request("/platform/appointments/mine"),
  doctorAppointments: () => request("/platform/appointments/doctor/mine"),
  doctorAppointmentsById: (doctorId) => request(`/platform/appointments/doctor/${encodeURIComponent(doctorId)}`),
  createAppointment: (payload) => request("/platform/appointments", { method: "POST", body: JSON.stringify(payload) }),
  updateAppointment: (id, status) => request(`/platform/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  clinicalRecords: () => request("/platform/clinical-records/mine"),
  createClinicalRecord: (payload) => request("/platform/clinical-records", { method: "POST", body: JSON.stringify(payload) }),
  prescriptions: () => request("/platform/prescriptions/mine"),
  createPrescription: (payload) => request("/platform/prescriptions", { method: "POST", body: JSON.stringify(payload) }),

  inventory: (pharmacyId) => request(`/platform/inventory/${encodeURIComponent(pharmacyId)}`),
  upsertInventory: (payload) => request("/platform/inventory", { method: "POST", body: JSON.stringify(payload) }),
  adjustInventory: (id, quantity) => request(`/platform/inventory/${id}`, { method: "PATCH", body: JSON.stringify({ quantity }) }),

  payments: () => request("/platform/payments/mine"),
  createPayment: (payload, idempotencyKey) => request("/platform/payments", { method: "POST", headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}, body: JSON.stringify(payload) }),
  updatePayment: (id, payload) => request(`/platform/payments/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  notifications: () => request("/platform/notifications"),
  markNotificationRead: (id) => request(`/platform/notifications/${id}/read`, { method: "PATCH" }),
  consents: () => request("/platform/consents"),
  grantConsent: (payload) => request("/platform/consents", { method: "POST", body: JSON.stringify(payload) }),
  revokeConsent: (id) => request(`/platform/consents/${id}/revoke`, { method: "PATCH" }),
  pendingDoctorVerifications: () => request("/platform/doctor-verifications/pending"),
  submitDoctorVerification: (payload) => request("/platform/doctor-verifications", { method: "POST", body: JSON.stringify(payload) }),
  decideDoctorVerification: (id, payload) => request(`/platform/doctor-verifications/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  auditCount: (action) => request(`/platform/audit/count/${encodeURIComponent(action)}`),
};

export { API_BASE_URL };
