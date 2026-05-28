export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/;

export const PASSWORD_RULE_MESSAGE =
  'Password must be 8-100 characters and include uppercase, lowercase, number, and special character';

export function isStrongPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}
