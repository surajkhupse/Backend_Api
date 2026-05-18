import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/paths'
import { useAppDispatch } from '../store/hooks'
import { setTokens } from '../store/slices/authSlice'
import {
  getLoginErrorMessage,
  isAccountLockedError,
  loginRequest,
} from '../services/api/auth'
import { loginFormSchema, type LoginFormValues } from '../schemas/loginFormSchema'
import { googleSsoStartUrl } from '../utils/apiBaseUrl'
import { GoogleLogo } from './GoogleLogo'

const inputClass =
  'w-full px-4 py-3 rounded-lg border bg-surface-bright font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-outline/50'

export type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const [apiError, setApiError] = useState<string | null>(null)
  const [lockUntil, setLockUntil] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const ssoUrl = googleSsoStartUrl()

  function handleGoogleSignIn() {
    if (!ssoUrl) {
      setApiError('API URL is not configured. Set VITE_API_URL in your environment.')
      return
    }
    window.location.href = ssoUrl
  }

  async function onSubmit(data: LoginFormValues) {
    setApiError(null)
    setLockUntil(null)
    try {
      const payload = await loginRequest({
        email: data.email,
        password: data.password,
      })
      dispatch(
        setTokens({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          rememberMe: data.rememberMe ?? false,
        }),
      )
      onSuccess?.()
    } catch (err) {
      if (isAccountLockedError(err)) {
        const body = err.response?.data
        if (body) {
          setLockUntil(body.lockUntil)
          setApiError(body.message)
        } else {
          setApiError(getLoginErrorMessage(err))
        }
      } else {
        setApiError(getLoginErrorMessage(err))
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
      >
        <GoogleLogo className="w-5 h-5 shrink-0" />
        Sign in with Google
      </button>

      <OrDivider />

      {(apiError || lockUntil) && (
        <AlertBanner lockUntil={lockUntil} message={apiError} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Field id="email" label="Email address" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            disabled={isSubmitting}
            className={`${inputClass} ${errors.email ? 'border-error' : 'border-outline-variant'}`}
            {...register('email')}
          />
        </Field>

        <Field
          id="password"
          label="Password"
          error={errors.password?.message}
          labelExtra={
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors"
            >
              Forgot password?
            </Link>
          }
        >
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`${inputClass} pr-12 ${errors.password ? 'border-error' : 'border-outline-variant'}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            disabled={isSubmitting}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all"
            {...register('rememberMe')}
          />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Remember me for 30 days
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-primary text-white rounded-lg font-label-md text-label-md font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span
                className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                aria-hidden
              />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </>
  )
}

function OrDivider() {
  return (
    <div className="relative my-8">
      <div aria-hidden className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant" />
      </div>
      <div className="relative flex justify-center font-label-sm text-label-sm">
        <span className="bg-surface-container-lowest px-4 text-outline uppercase tracking-widest">
          or continue with email
        </span>
      </div>
    </div>
  )
}

function AlertBanner({
  message,
  lockUntil,
}: {
  message: string | null
  lockUntil: string | null
}) {
  const isLock = !!lockUntil
  return (
    <div
      role="alert"
      className={`mb-6 rounded-lg border px-4 py-3 text-left font-body-sm text-body-sm ${
        isLock
          ? 'border-tertiary-fixed-dim bg-tertiary-fixed text-on-tertiary-fixed'
          : 'border-error bg-error-container text-on-error-container'
      }`}
    >
      {message}
      {lockUntil && (
        <p className="mt-2 font-label-sm text-label-sm opacity-90">
          Unlocks after{' '}
          {new Date(lockUntil).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      )}
    </div>
  )
}

function Field({
  id,
  label,
  error,
  labelExtra,
  children,
}: {
  id: string
  label: string
  error?: string
  labelExtra?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      {labelExtra ? (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={id}
            className="block font-label-md text-label-md text-on-surface-variant"
          >
            {label}
          </label>
          {labelExtra}
        </div>
      ) : (
        <label
          htmlFor={id}
          className="block font-label-md text-label-md text-on-surface-variant mb-2"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 font-label-sm text-label-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
