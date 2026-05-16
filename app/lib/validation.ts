import { z } from 'zod';

const ZA_ID_REGEX = /^\d{13}$/;
const PHONE_REGEX = /^(?:\+27|0)\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export type UserRole = 'parent' | 'driver';

export function normalizeSouthAfricanId(value: string) {
  return value.replace(/\D/g, '');
}

export function normalizePhoneNumber(value: string) {
  const compact = value.replace(/[\s()-]/g, '');
  if (compact.startsWith('+27')) {
    return compact;
  }

  if (compact.startsWith('0') && compact.length === 10) {
    return `+27${compact.slice(1)}`;
  }

  return compact;
}

function luhnCheck(value: string) {
  let sum = 0;
  let shouldDouble = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isValidSouthAfricanId(value: string) {
  const normalized = normalizeSouthAfricanId(value);
  if (!ZA_ID_REGEX.test(normalized)) {
    return false;
  }

  return luhnCheck(normalized);
}

export function isValidPhoneNumber(value: string) {
  const normalized = normalizePhoneNumber(value);
  return PHONE_REGEX.test(normalized);
}

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(PASSWORD_REGEX, 'Password must include upper, lower, number and special character.');

const baseCredentialSchema = {
  southAfricanId: z
    .string()
    .min(13, 'South African ID must be 13 digits.')
    .max(13, 'South African ID must be 13 digits.')
    .refine(isValidSouthAfricanId, 'Enter a valid South African ID number.'),
  password: passwordSchema
};

export const loginSchema = z.object({
  southAfricanId: z
    .string()
    .min(13, 'South African ID must be 13 digits.')
    .max(13, 'South African ID must be 13 digits.')
    .refine(isValidSouthAfricanId, 'Enter a valid South African ID number.'),
  password: z.string().min(1, 'Password is required.')
});

export const registerSchema = z
  .object({
    role: z.enum(['parent', 'driver']),
    fullName: z.string().min(2, 'Full name is required.'),
    southAfricanId: baseCredentialSchema.southAfricanId,
    phoneNumber: z.string().refine(isValidPhoneNumber, 'Enter a valid South African phone number.'),
    pdpLicenseNumber: z.string().optional(),
    password: baseCredentialSchema.password,
    confirmPassword: z.string()
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.'
      });
    }

    if (value.role === 'driver' && !value.pdpLicenseNumber?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pdpLicenseNumber'],
        message: 'PDP license number is required for drivers.'
      });
    }
  });

export const requestPasswordResetSchema = z.object({
  southAfricanId: baseCredentialSchema.southAfricanId,
  phoneNumber: z.string().refine(isValidPhoneNumber, 'Enter a valid South African phone number.')
});

export const verifyOtpSchema = z.object({
  southAfricanId: baseCredentialSchema.southAfricanId,
  phoneNumber: z.string().refine(isValidPhoneNumber, 'Enter a valid South African phone number.'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code.')
});

export const resetPasswordSchema = z
  .object({
    southAfricanId: baseCredentialSchema.southAfricanId,
    phoneNumber: z.string().refine(isValidPhoneNumber, 'Enter a valid South African phone number.'),
    password: baseCredentialSchema.password,
    confirmPassword: z.string()
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.'
      });
    }
  });

export const authSessionSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['parent', 'driver']),
  southAfricanId: z.string(),
  fullName: z.string(),
  sessionId: z.string().uuid(),
  deviceFingerprint: z.string()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
