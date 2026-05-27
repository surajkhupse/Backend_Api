import { z } from 'zod'

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
})

export type CreateTenantFormValues = z.output<typeof createTenantFormSchema>
