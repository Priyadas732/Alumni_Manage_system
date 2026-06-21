// src/api.js  — Central API helper

const BASE_URL = ''; // Vite proxy handles the routing

// ─── Helper: make authenticated requests ──────────────────────────────────────
async function request(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(BASE_URL + url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ─── USER / PROFILE ────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => request('/users/profile'),

  updateProfile: (profileData) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  getUserById: (id) => request(`/users/${id}`),
};

// ─── ALUMNI DIRECTORY & REQUESTS ──────────────────────────────────────────────
export const requestAPI = {
  getDirectory: () => request('/requests/directory'),

  sendRequest: (receiverId, type, message, jobLink, resumeUrl) =>
    request('/requests/create', {
      method: 'POST',
      body: JSON.stringify({ receiverId, type, message, jobLink, resumeUrl }),
    }),

  getMyRequests: () => request('/requests/my-requests'),

  updateStatus: (requestId, status) =>
    request(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ─── EXPERIENCE FEED (POSTS) ───────────────────────────────────────────────────
export const postAPI = {
  getPosts: () => request('/posts'),

  createPost: (content, tags = [], imageUrl, videoUrl) =>
    request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, tags, imageUrl, videoUrl }),
    }),

  toggleLike: (postId) =>
    request(`/posts/${postId}/like`, { method: 'POST' }),

  addComment: (postId, content) =>
    request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// ─── CHAT / CONVERSATIONS ──────────────────────────────────────────────────────
export const chatAPI = {
  getConversations: () => request('/conversations'),

  getMessages: (conversationId) =>
    request(`/conversations/${conversationId}/messages`),

  sendMessage: (conversationId, content) =>
    request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  startConversation: (recipientId) =>
    request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    }),
};
