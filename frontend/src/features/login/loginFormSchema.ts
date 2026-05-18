import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .transform((val) => val.trim())
    .pipe(z.string().email('Enter a valid email')),
  password: z
    .string()
    .min(1, 'Password is required')
    .transform((val) => val.trim())
    .pipe(z.string().min(1, 'Password is required')),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.output<typeof loginFormSchema>
