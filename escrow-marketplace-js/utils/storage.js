"use client";

import { STORAGE_KEYS } from "./constants";

export function getUsers() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

export function setUsers(users) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function createUser(user) {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

export function getUserByEmailAndRole(email, role) {
  const users = getUsers();
  return users.find((u) => u.email === email && u.role === role);
}

export function getPendingUsers() {
  const users = getUsers();
  return users.filter((u) => !u.approved && u.role !== "admin");
}

export function approveUser(email) {
  const users = getUsers();
  const updated = users.map((u) =>
    u.email === email ? { ...u, approved: true } : u
  );
  setUsers(updated);
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getJobs() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
  return raw ? JSON.parse(raw) : [];
}

export function setJobs(jobs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
}
