import { SessionExpiredHandler } from './components/SessionExpiredHandler'
import { AppRoutes } from './routes'

function App() {
  return (
    <>
      <SessionExpiredHandler />
      <AppRoutes />
    </>
  )
}

export default App
