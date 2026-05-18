import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { APP_BRAND_NAME } from '../constants'
import { ROUTES } from '../routes/paths'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="mesh-gradient min-h-screen flex items-center justify-center p-gutter-mobile md:p-gutter-desktop">
      <main className="w-full max-w-[440px] animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary shadow-lg mb-6">
            <span
              className="material-symbols-outlined filled text-white text-[32px]"
              aria-hidden
            >
              event_available
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            {APP_BRAND_NAME}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sign in to your account
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
          <LoginForm onSuccess={() => navigate(ROUTES.HOME, { replace: true })} />
        </div>

        <p className="text-center mt-8 font-body-sm text-body-sm text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.SIGN_UP}
            className="font-label-md text-label-md text-primary font-bold hover:text-primary-container transition-colors ml-1"
          >
            Sign up for free
          </Link>
        </p>

        <div className="mt-12 flex justify-center items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container" aria-hidden />
            <span className="font-label-sm text-label-sm text-outline">System operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-outline" aria-hidden>
              lock
            </span>
            <span className="font-label-sm text-label-sm text-outline">Secure 256-bit SSL</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-gutter-desktop right-gutter-desktop hidden md:block">
        <button
          type="button"
          className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-full shadow-sm hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden>
            help_outline
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant">Support</span>
        </button>
      </div>
    </div>
  )
}
