import { useTranslation } from 'react-i18next'

import { InputField, SelectField, TextAreaField } from '../../components/Field'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import localeOptions from '../../constants/localeOptions'
import AvatarUpload from '../../components/AvatarUpload'
import { BackSvg } from '../../icons'
import {
  FULL_NAME_MAX_LIMIT,
  FULL_NAME_MIN_LIMIT,
} from '../../constants/restrictions'
import useComponent from './useComponent'
import './styles.css'

export default function ProfileScreen() {
  const {
    forms: { profileForm },
    data: { isOffline },
    store: { error, loading },
    handlers: { onBack, handleCancel },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <div className="profile-screen">
      <form className="profile-screen-form" onSubmit={profileForm.handleSubmit}>
        <div className="profile-screen-header">
          <button className="back d-hidden" type="button" onClick={onBack}>
            <BackSvg className="icon" />
          </button>
          <p className="title header-title">{t('Profile')}</p>
        </div>
        <div className="profile-screen-body">
          <FormField
            htmlFor="avatar"
            label={t('AddPhoto')}
            error={profileForm.touched.avatar && profileForm.errors.avatar}
          >
            <AvatarUpload
              loading={loading}
              id="avatar"
              name="avatar"
              onChange={(value) => profileForm.setFieldValue('avatar', value)}
              onBlur={profileForm.handleBlur}
              value={profileForm.values.avatar}
            />
          </FormField>
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
              profileForm.touched.full_name && profileForm.errors.full_name
            }
          >
            <InputField
              autoComplete="name"
              disabled={loading}
              id="full_name"
              name="full_name"
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
              type="text"
              value={profileForm.values.full_name}
            />
          </FormField>
          <FormField
            htmlFor="email"
            label={t('Email')}
            error={profileForm.touched.email && profileForm.errors.email}
          >
            <InputField
              autoComplete="email"
              disabled={loading}
              id="email"
              name="email"
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
              type="email"
              value={profileForm.values.email}
            />
          </FormField>
          <FormField
            htmlFor="description"
            label={t('AboutYou')}
            error={
              profileForm.touched.description && profileForm.errors.description
            }
          >
            <TextAreaField
              disabled={loading}
              id="description"
              name="description"
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
              value={profileForm.values.description}
              rows={8}
            />
          </FormField>

          <p className="title mt-40">{t('Credentials')}</p>
          <FormField
            htmlFor="old_password"
            label={t('OldPassword')}
            error={
              profileForm.touched.old_password &&
              profileForm.errors.old_password
            }
          >
            <InputField
              autoComplete="new-password"
              disabled={loading}
              id="old_password"
              name="old_password"
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
              type="password"
              value={profileForm.values.old_password}
            />
          </FormField>
          <FormField
            htmlFor="password"
            label={t('NewPassword')}
            error={profileForm.touched.password && profileForm.errors.password}
          >
            <InputField
              autoComplete="new-password"
              disabled={loading}
              id="password"
              name="password"
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
              type="password"
              value={profileForm.values.password}
            />
          </FormField>
          <FormField
            htmlFor="confirm_password"
            label={t('ConfirmPassword')}
            error={
              profileForm.touched.confirm_password &&
              profileForm.errors.confirm_password
            }
          >
            <InputField
              autoComplete="new-password"
              disabled={loading}
              id="confirm_password"
              name="confirm_password"
              onChange={profileForm.handleChange}
              onBlur={profileForm.handleBlur}
              type="password"
              value={profileForm.values.confirm_password}
            />
          </FormField>

          <p className="title mt-40">{t('Settings')}</p>
          <FormField
            htmlFor="language"
            label={t('Language')}
            error={profileForm.touched.language && profileForm.errors.language}
          >
            <SelectField
              disabled={loading}
              id="language"
              name="language"
              onChange={(value) => profileForm.setFieldValue('language', value)}
              onBlur={profileForm.handleBlur}
              value={profileForm.values.language}
              options={localeOptions}
            />
          </FormField>

          <div className="btn-group">
            <Button
              mobileSize="auto"
              theme="primary"
              loading={loading}
              disabled={isOffline}
              type="submit"
              className="btn"
            >
              {t('Save')}
            </Button>
            <Button
              mobileSize="auto"
              loading={loading}
              onClick={handleCancel}
              className="btn"
            >
              {t('Cancel')}
            </Button>
          </div>
          {error && (
            <div className="error-form">
              {error &&
                t([
                  `${error
                    .toUpperCase()
                    .replaceAll(' ', '_')
                    .replace(/[.:]/g, '')}`,
                  error,
                ])}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
