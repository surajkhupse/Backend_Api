import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { clearTenantError, createTenant } from '../../../store/slices/tenantSlice'
import { createTenantFormSchema, type CreateTenantFormValues } from '../createTenantSchema'

type CreateTenantDialogProps = {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

export function CreateTenantDialog({ open, onClose, onCreated }: CreateTenantDialogProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.tenants)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTenantFormValues>({
    resolver: zodResolver(createTenantFormSchema),
    defaultValues: {
      name: '',
      domain: '',
      status: 'active',
      ownerEmail: '',
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
      dispatch(clearTenantError())
    }
  }, [open, reset, dispatch])

  async function onSubmit(values: CreateTenantFormValues) {
    const result = await dispatch(
      createTenant({
        name: values.name,
        domain: values.domain,
        status: values.status,
        ownerEmail: values.ownerEmail,
      }),
    )
    if (createTenant.fulfilled.match(result)) {
      onCreated?.()
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create tenant</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2.5}>
            <Typography variant="bodySm" color="text.secondary">
              Assign an existing registered user as the tenant owner. They will become{' '}
              <strong>tenant_admin</strong> for this organization.
            </Typography>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Tenant name"
              required
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message ?? 'Slug is generated automatically from the name'}
              {...register('name')}
            />

            <TextField
              label="Custom domain"
              fullWidth
              placeholder="acme.example.com"
              error={Boolean(errors.domain)}
              helperText={errors.domain?.message ?? 'Optional'}
              {...register('domain')}
            />

            <TextField
              select
              label="Status"
              fullWidth
              defaultValue="active"
              error={Boolean(errors.status)}
              helperText={errors.status?.message}
              {...register('status')}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>

            <TextField
              label="Owner email"
              required
              fullWidth
              type="email"
              placeholder="admin@company.com"
              error={Boolean(errors.ownerEmail)}
              helperText={
                errors.ownerEmail?.message ??
                'User must already exist (register first if needed)'
              }
              {...register('ownerEmail')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading || isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting}
            startIcon={loading || isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            Create tenant
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
