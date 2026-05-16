import { z } from 'zod';

const ZA_ID_REGEX = /^\d{13}$/;
const PHONE_REGEX = /^(?:\+27|0)\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export type UserRole = 'parent' | 'driver' | 'owner';

export function normalizeSouthAfricanId(value: string) { return value.replace(/\D/g, ''); }
export function normalizePhoneNumber(value: string) {
  const compact = value.replace(/[\s()-]/g, '');
  if (compact.startsWith('+27')) return compact;
  if (compact.startsWith('0') && compact.length === 10) return `+27${compact.slice(1)}`;
  return compact;
}

function luhnCheck(value: string) { let sum = 0, dbl = false; for (let i = value.length - 1; i >= 0; i--) { let d = Number(value[i]); if (dbl) { d *= 2; if (d > 9) d -= 9; } sum += d; dbl = !dbl; } return sum % 10 === 0; }
export function isValidSouthAfricanId(value: string) { const n = normalizeSouthAfricanId(value); return ZA_ID_REGEX.test(n) && luhnCheck(n); }
export function isValidPhoneNumber(value: string) { return PHONE_REGEX.test(normalizePhoneNumber(value)); }

export const passwordSchema = z.string().min(8).regex(PASSWORD_REGEX, 'Password must include upper, lower, number and special character.');

const zaIdSchema = z.string().refine(isValidSouthAfricanId, 'Enter a valid South African ID number.');

export const loginSchema = z.object({ southAfricanId: zaIdSchema, password: z.string().min(1), captchaToken: z.string().optional(), deviceFingerprint: z.string().min(12).optional() });
export const registerParentSchema = z.object({ fullName: z.string().min(2), southAfricanId: zaIdSchema, phoneNumber: z.string().refine(isValidPhoneNumber), password: passwordSchema, confirmPassword: z.string(), captchaToken: z.string().optional() }).refine(v => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });
export const registerDriverSchema = z.object({ fullName: z.string().min(2), southAfricanId: zaIdSchema, phoneNumber: z.string().refine(isValidPhoneNumber), pdpLicenseNumber: z.string().min(4), vehicleRegistrationNumber: z.string().min(4).optional(), password: passwordSchema, confirmPassword: z.string(), captchaToken: z.string().optional() }).refine(v => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });

export const registerSchema = z.discriminatedUnion('role', [
  registerParentSchema.extend({ role: z.literal('parent') }),
  registerDriverSchema.extend({ role: z.literal('driver') })
]);

export const requestPasswordResetSchema = z.object({ southAfricanId: zaIdSchema, phoneNumber: z.string().refine(isValidPhoneNumber) });
export const verifyOtpSchema = z.object({ southAfricanId: zaIdSchema, phoneNumber: z.string().refine(isValidPhoneNumber), otp: z.string().regex(/^\d{6}$/) });
export const resetPasswordSchema = z.object({ southAfricanId: zaIdSchema, phoneNumber: z.string().refine(isValidPhoneNumber), password: passwordSchema, confirmPassword: z.string() }).refine(v => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterParentInput = z.infer<typeof registerParentSchema>;
export type RegisterDriverInput = z.infer<typeof registerDriverSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
