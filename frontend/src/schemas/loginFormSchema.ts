import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .transform((val) => val.trim())
    .pipe(z.string().email('Enter a valid email')),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginFormValues = z.input<typeof loginFormSchema>
