import { useTranslation } from 'react-i18next'

import FormField from '../../components/FormField'
import Header from '../../modules/Header'
import useComponent from './useComponent'
import { InputField } from '../../components/Field'
import Button from '../../components/Button'
import './styles.css'

export default function LoginScreen() {
  const {
    forms: { loginForm },
    data: { error, loading, isCompletedForm, isOffLine },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <main className="login-screen">
      <Header />
      <form className="login-form" onSubmit={loginForm.handleSubmit}>
        <p className="title">{t('EnterEmailAndPassword')}</p>
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={!isCompletedForm || isOffLine}
            loading={loading}
            type="submit"
            className="btn"
          >
            {t('Login')}
          </Button>
        </div>
        {error && <div className="error-form">{error}</div>}
      </form>
    </main>
  )
}
