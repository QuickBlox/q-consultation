import { Redirect, Route, Switch } from 'react-router-dom'

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
      <Switch>
        <Route path={LOGIN_ROUTE} component={EmailLoginScreen} />
        <Route path={SIGNUP_ROUTE} component={RegistrationScreen} />
        <Redirect
          to={{
            pathname: LOGIN_ROUTE,
            state: { referrer },
          }}
        />
      </Switch>
    </main>
  )
}
