import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import FormField from '../../../components/FormField'
import Button from '../../../components/Button'
import { InputField } from '../../../components/Field'
import useComponent, { GuestUserModalProps } from './useComponent'
import './styles.css'
import {
  FULL_NAME_MAX_LIMIT,
  FULL_NAME_MIN_LIMIT,
} from '../../../constants/restrictions'

export default function GuestUserModal(props: GuestUserModalProps) {
  const {
    forms: { guestUserForm },
    store: { opened },
    refs: { backdrop },
    data: { isLoading, isOffline },
    handlers: { onCancelClick, onBackdropClick },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal guest-user', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">{t('CreateGuestUser')}</div>
        <div className="body">
          <form onSubmit={guestUserForm.handleSubmit}>
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
                guestUserForm.touched.full_name &&
                guestUserForm.errors.full_name &&
                t(guestUserForm.errors.full_name)
              }
            >
              <InputField
                autoComplete="name"
                disabled={isLoading}
                id="full_name"
                name="full_name"
                onChange={guestUserForm.handleChange}
                onBlur={guestUserForm.handleBlur}
                type="text"
                value={guestUserForm.values.full_name}
                placeholder={t('GuestName')}
              />
            </FormField>
            <div className="btn-group">
              <Button
                size="xl"
                theme="primary"
                loading={isLoading}
                disabled={isOffline}
                type="submit"
                className="btn copy-btn"
              >
                {t('CopyLink')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
