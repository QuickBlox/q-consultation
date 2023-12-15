import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { DateInputField, InputField, RadioField } from '../../components/Field'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import { LOGIN_ROUTE } from '../../constants/routes'
import {
  FULL_NAME_MAX_LIMIT,
  FULL_NAME_MIN_LIMIT,
} from '../../constants/restrictions'
import useComponent from './useComponent'
import './styles.css'

export default function RegistrationScreen() {
  const {
    forms: { registerForm },
    data: { isOffLine, loading, error, location },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div className="register-screen">
      <form className="register-form" onSubmit={registerForm.handleSubmit}>
        <p className="title">{t('CreateAnAccount')}</p>
        <p className="subtitle">
          {t('AlreadyHaveAccount')}
          <Link className="link" to={LOGIN_ROUTE} state={location.state}>
            {t('SignIn')}
          </Link>
        </p>
        <FormField
          htmlFor="email"
          label={t('Email')}
          error={
            registerForm.touched.email &&
            registerForm.errors.email &&
            registerForm.errors.email
          }
        >
          <InputField
            autoComplete="email"
            id="email"
            name="email"
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            type="email"
            value={registerForm.values.email}
            placeholder={t('EmailFormat')}
          />
        </FormField>
        <FormField
          htmlFor="password"
          label={t('Password')}
          error={
            registerForm.touched.password &&
            registerForm.errors.password &&
            registerForm.errors.password
          }
        >
          <InputField
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            type="password"
            value={registerForm.values.password}
            placeholder={t('YourPassword')}
          />
        </FormField>
        <FormField
          htmlFor="confirm_password"
          label={t('ConfirmPassword')}
          error={
            registerForm.touched.confirm_password &&
            registerForm.errors.confirm_password
          }
        >
          <InputField
            autoComplete="new-password"
            id="confirm_password"
            name="confirm_password"
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            type="password"
            value={registerForm.values.confirm_password}
            placeholder={t('ConfirmYourPassword')}
          />
        </FormField>

        <p className="form-block-title">{t('PersonalInfo')}</p>

        <FormField
          htmlFor="full_name"
          label={t('FullName')}
          hint={[
            t('FIRST_ALPHANUMERIC_CHAR'),
            t('ONLY_ALPHANUMERIC_SPECIAL_CHAR', { char: '.-’_' }),
            t('ONLY_ONE_SPECIAL_CHAR', { char: '.-’_' }),
            t('MIN_LENGTH_CHAR', { count: FULL_NAME_MIN_LIMIT }),
            t('MAX_LENGTH_CHAR', { count: FULL_NAME_MAX_LIMIT }),
          ]}
          error={
            registerForm.touched.full_name && registerForm.errors.full_name
          }
        >
          <InputField
            autoComplete="name"
            id="full_name"
            name="full_name"
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            type="text"
            value={registerForm.values.full_name}
            placeholder={t('YourName')}
          />
        </FormField>

        <div className="form-field-row">
          <FormField
            className="form-field-col"
            htmlFor="birthdate"
            label={t('DateOfBirth')}
            error={
              registerForm.touched.birthdate && registerForm.errors.birthdate
            }
          >
            <DateInputField
              value={registerForm.values.birthdate}
              onDayChange={(day, inputValue) => {
                registerForm.setFieldValue('birthdate', day || inputValue)
              }}
              inputProps={{
                id: 'birthdate',
                name: 'birthdate',
                onBlur: registerForm.handleBlur,
              }}
              disabled={{
                after: new Date(),
              }}
            />
          </FormField>
          <FormField
            className="form-field-col"
            htmlFor="gender"
            label={t('Gender')}
            error={registerForm.touched.gender && registerForm.errors.gender}
          >
            <div className="form-field-radio-group">
              <RadioField
                checked={registerForm.values.gender === 'male'}
                name="gender"
                className="mr-10"
                onChange={registerForm.handleChange}
                value="male"
                label={t('male')}
              />
              <RadioField
                checked={registerForm.values.gender === 'female'}
                name="gender"
                onChange={registerForm.handleChange}
                value="female"
                label={t('female')}
              />
            </div>
          </FormField>
        </div>
        <FormField
          htmlFor="address"
          label={t('Address')}
          error={registerForm.touched.address && registerForm.errors.address}
        >
          <InputField
            autoComplete="shipping street-address"
            id="address"
            name="address"
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            type="text"
            value={registerForm.values.address}
            placeholder={t('YourAddress')}
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
            {t('CreateAccount')}
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
