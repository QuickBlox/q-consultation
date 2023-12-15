import { Navigate, Route, Routes } from 'react-router-dom'

import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../constants/routes'
import Header from '../../modules/Header'
import EmailLoginScreen from '../EmailLoginScreen'
import RegistrationScreen from '../RegistrationScreen'
import usePrivateReferrer from '../../hooks/usePrivateReferrer'

export default function AuthScreen() {
  const referrer = usePrivateReferrer()

  return (
    <main className="auth-screen">
      <Header />
      <Routes>
        <Route path={LOGIN_ROUTE} element={<EmailLoginScreen />} />
        <Route path={SIGNUP_ROUTE} element={<RegistrationScreen />} />
        <Route
          path="*"
          element={<Navigate to={LOGIN_ROUTE} state={{ referrer }} replace />}
        />
      </Routes>
    </main>
  )
}
