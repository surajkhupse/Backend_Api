// External libraries
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// MUI Components
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Store
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  clearTenantError,
  createTenant,
} from "../../../store/slices/tenantSlice";
import { login } from "../../../store/slices/authSlice";
import { ROUTES } from "../../../routes/paths";

// Schema
import {
  createTenantFormSchema,
  type CreateTenantFormValues,
} from "../createTenantSchema";

type CreateTenantDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export function CreateTenantDialog({
  open,
  onClose,
  onCreated,
}: CreateTenantDialogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.tenants);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTenantFormValues>({
    resolver: zodResolver(createTenantFormSchema),
    defaultValues: {
      name: "",
      domain: "",
      status: "active",
      ownerEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      dispatch(clearTenantError());
    }
  }, [open, reset, dispatch]);

  async function onSubmit(values: CreateTenantFormValues) {
    const result = await dispatch(
      createTenant({
        name: values.name,
        domain: values.domain,
        status: values.status,
        ownerEmail: values.ownerEmail,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }),
    );
    if (createTenant.fulfilled.match(result)) {
      onCreated?.();
      onClose();
    }
  }

  async function onCreateAndImpersonate(values: CreateTenantFormValues) {
    const createResult = await dispatch(
      createTenant({
        name: values.name,
        domain: values.domain,
        status: values.status,
        ownerEmail: values.ownerEmail,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }),
    );

    if (!createTenant.fulfilled.match(createResult)) {
      return;
    }

    const loginResult = await dispatch(
      login({
        email: values.ownerEmail.trim().toLowerCase(),
        password: values.password,
        rememberMe: false,
      }),
    );

    onCreated?.();
    onClose();

    if (login.fulfilled.match(loginResult)) {
      navigate(ROUTES.TENANT_DASHBOARD);
      return;
    }

    window.alert(
      "Tenant created, but impersonation failed. Please sign in with tenant credentials.",
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create tenant</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2.5}>
            <Typography variant="bodySm" color="text.secondary">
              Set credentials for the tenant owner account. They will become{" "}
              <strong>tenant_admin</strong> for this organization.
            </Typography>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Tenant name"
              required
              fullWidth
              error={Boolean(errors.name)}
              helperText={
                errors.name?.message ??
                "Slug is generated automatically from the name"
              }
              {...register("name")}
            />

            <TextField
              label="Custom domain"
              fullWidth
              placeholder="acme.example.com"
              error={Boolean(errors.domain)}
              helperText={errors.domain?.message ?? "Optional"}
              {...register("domain")}
            />

            <TextField
              select
              label="Status"
              fullWidth
              defaultValue="active"
              error={Boolean(errors.status)}
              helperText={errors.status?.message}
              {...register("status")}
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
                "Login email for the tenant admin account"
              }
              {...register("ownerEmail")}
            />

            <TextField
              label="Password"
              required
              fullWidth
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register("password")}
            />

            <TextField
              label="Confirm password"
              required
              fullWidth
              type="password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register("confirmPassword")}
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
            startIcon={
              loading || isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            Create tenant
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={loading || isSubmitting}
            onClick={handleSubmit(onCreateAndImpersonate)}
          >
            Create and impersonate
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
