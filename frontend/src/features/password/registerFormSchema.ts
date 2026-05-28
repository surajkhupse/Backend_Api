import { z } from 'zod'
import { PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } from '../../utils/passwordValidation'

export const registerFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .transform((val) => val.trim())
    .pipe(z.string().min(2, 'Enter your full name')),
  email: z
    .string()
    .min(1, 'Work email is required')
    .transform((val) => val.trim())
    .pipe(z.string().email('Enter a valid email')),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .transform((val) => val.trim())
    .pipe(z.string().min(2, 'Enter your company name')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .regex(PASSWORD_REGEX, PASSWORD_RULE_MESSAGE),
    ),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: 'You must accept the terms to continue',
  }),
})

export type RegisterFormValues = z.input<typeof registerFormSchema>
