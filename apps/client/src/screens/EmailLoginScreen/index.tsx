import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { InputField } from '../../components/Field'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import { SIGNUP_ROUTE } from '../../constants/routes'
import useComponent from './useComponent'
import './styles.css'

export default function EmailLoginScreen() {
  const {
    forms: { loginForm },
    data: { isOffLine, loading, error, location },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div className="login-screen">
      <form className="login-form" onSubmit={loginForm.handleSubmit}>
        <p className="title">{t('SignIntoAccount')}</p>
        <p className="subtitle">
          {t('DontHaveAccount')}
          <Link className="link" to={SIGNUP_ROUTE} state={location.state}>
            {t('SignUp')}
          </Link>
        </p>
        <FormField
          htmlFor="email"
          label={t('Email')}
          error={
            loginForm.touched.email &&
            loginForm.errors.email &&
            t(loginForm.errors.email)
          }
        >
          <InputField
            autoComplete="email"
            id="email"
            name="email"
            onChange={loginForm.handleChange}
            onBlur={loginForm.handleBlur}
            type="email"
            value={loginForm.values.email}
            placeholder={t('EmailFormat')}
          />
        </FormField>
        <FormField
          htmlFor="password"
          label={t('Password')}
          error={
            loginForm.touched.password &&
            loginForm.errors.password &&
            t(loginForm.errors.password)
          }
        >
          <InputField
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={loginForm.handleChange}
            onBlur={loginForm.handleBlur}
            type="password"
            value={loginForm.values.password}
            placeholder={t('YourPassword')}
          />
        </FormField>

        <div className="btn-group">
          <Button
            theme="primary"
            disabled={isOffLine}
            loading={loading}
            type="submit"
            className="btn"
            size="sm"
          >
            {t('SignIn')}
          </Button>
        </div>
        {error && (
          <div className="error-form">
            {t(
              `${error
                .toUpperCase()
                .replaceAll(' ', '_')
                .replace(/[.:]/g, '')}`,
              error,
            )}
          </div>
        )}
      </form>
    </div>
  )
}
