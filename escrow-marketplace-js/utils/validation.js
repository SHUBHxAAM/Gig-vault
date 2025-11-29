export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function validateSignup(data) {
  if (!data.name.trim()) return "Name is required.";
  if (!data.phone.trim()) return "Phone is required.";
  if (!validateEmail(data.email)) return "Invalid email.";
  if (data.password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateLogin(data) {
  if (!validateEmail(data.email)) return "Invalid email.";
  if (!data.password) return "Password is required.";
  return null;
}
