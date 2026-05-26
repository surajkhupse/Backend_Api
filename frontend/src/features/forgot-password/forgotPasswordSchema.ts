import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .transform((val) => val.trim().toLowerCase())
    .pipe(z.string().email('Enter a valid email address')),
})

export type ForgotPasswordValues = z.input<typeof forgotPasswordSchema>
