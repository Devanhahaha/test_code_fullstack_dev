// ============================================================
// src/services/api.ts
// Centralized API service for Laravel 12 backend
// ============================================================

export const BASE_URL = 'http://192.168.1.5:8000/api';

// --------------- Auth Helpers ---------------

export const getToken = (): string | null => localStorage.getItem('token');

export const setToken = (token: string): void => localStorage.setItem('token', token);

export const setUserInfo = (user: { id: number; name: string; email: string; role: string }): void =>
  localStorage.setItem('user', JSON.stringify(user));

export const getUserInfo = (): { id: number; name: string; email: string; role: string } | null => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// --------------- Request Helpers ---------------

const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const apiPost = async <T = unknown>(
  path: string,
  body: unknown,
  authenticated = false
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (authenticated) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
};

export const apiGet = async <T = unknown>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
};

export const apiPut = async <T = unknown>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
};

export const apiPatch = async <T = unknown>(path: string, body?: unknown): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
};

// --------------- Type Definitions ---------------

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  project?: {
    id: number;
    name: string;
  };
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  status: string;
  unread_count: number;
  data: Notification[];
}

export interface TasksResponse {
  status: string;
  data: Task[];
}
