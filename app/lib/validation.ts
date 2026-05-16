export function isValidEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!email || email.includes(' ')) {
    return false;
  }

  return /^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email);
}
