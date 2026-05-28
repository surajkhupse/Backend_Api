import { z } from 'zod'
import { PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } from '../../utils/passwordValidation'

const tenantStatusSchema = z.enum(['active', 'inactive', 'suspended'])

export const createTenantFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tenant name is required')
    .max(120, 'Name is too long')
    .transform((v) => v.trim()),
  domain: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
  status: tenantStatusSchema.default('active'),
  ownerEmail: z
    .string()
    .min(1, 'Owner email is required')
    .transform((v) => v.trim().toLowerCase())
    .pipe(z.string().email('Enter a valid owner email')),
  password: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().regex(PASSWORD_REGEX, PASSWORD_RULE_MESSAGE)),
  confirmPassword: z
    .string()
    .min(1, 'Confirm password is required'),
})
.refine((values) => values.password === values.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

export type CreateTenantFormValues = z.input<typeof createTenantFormSchema>
