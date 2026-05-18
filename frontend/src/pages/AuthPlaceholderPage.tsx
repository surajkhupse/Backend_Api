import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/paths'

type Props = {
  title: string
  description: string
}

export function AuthPlaceholderPage({ title, description }: Props) {
  return (
    <div className="mesh-gradient min-h-screen flex items-center justify-center p-gutter-mobile">
      <main className="w-full max-w-md text-center animate-fade-in">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">{title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">{description}</p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-block font-label-md text-label-md text-primary font-bold hover:text-primary-container transition-colors"
        >
          Back to sign in
        </Link>
      </main>
    </div>
  )
}
