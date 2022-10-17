import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { useEffect } from 'react'
import { createUseComponent, useActions, useForm } from '../../hooks'
import useIsOffLine from '../../hooks/useIsOffLine'
import { validateEmail, validateFullName } from '../../utils/validate'
import { clearAuthError, createAccount, emailLogin } from '../../actionCreators'
import { createMapStateSelector } from '../../utils/selectors'
import {
  authErrorSelector,
  authLoadingSelector,
  qbErrorSelector,
  qbLoadingSelector,
} from '../../selectors'

interface FormValues
  extends Pick<QBUser, 'full_name' | 'email'>,
    Required<Pick<QBUser, 'password'>>,
    Pick<QBUserCustomData, 'address' | 'gender'> {
  birthdate: QBUserCustomData['birthdate'] | Date
  confirm_password: QBUser['password']
}

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

const selector = createMapStateSelector({
  qbError: qbErrorSelector,
  authError: authErrorSelector,
  authLoading: authLoadingSelector,
  qbLoading: qbLoadingSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({
    createAccount,
    emailLogin,
    clearAuthError,
  })
  const location = useLocation<{ referrer?: string }>()
  const isOffLine = useIsOffLine()
  const { t } = useTranslation()

  const { qbLoading, authLoading, qbError, authError } = store

  const loading = qbLoading || authLoading
  const error = qbError || authError

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}
    const requiredFields: Array<keyof FormValues> = [
      'email',
      'password',
      'confirm_password',
      'full_name',
      'gender',
      'birthdate',
    ]

    requiredFields.forEach((name) => {
      if (!values[name]) errors[name] = t('REQUIRED')
    })

    if (!errors.email && !validateEmail(values.email)) {
      errors.email = t('INVALID_FORMAT')
    }

    if (!errors.email && values.email.length > 100) {
      errors.email = t('MAX_LENGTH_CHAR', {
        count: 100,
      })
    }

    if (!errors.password) {
      if (values.password.length < 8) {
        errors.password = t('MIN_LENGTH_CHAR', {
          count: 8,
        })
      }

      if (values.password.length > 50) {
        errors.password = t('MAX_LENGTH_CHAR', {
          count: 50,
        })
      }
    }

    if (
      !errors.password &&
      !errors.confirm_password &&
      values.password &&
      values.confirm_password &&
      values.password !== values.confirm_password
    ) {
      errors.confirm_password = t('PASSWORD_MISMATCH')
    }

    if (!errors.full_name && !validateFullName(values.full_name)) {
      errors.full_name = t('INVALID_FORMAT')
    }

    if (values.birthdate && !errors.birthdate) {
      if (
        !(
          values.birthdate instanceof Date ||
          moment(values.birthdate, moment.HTML5_FMT.DATE, true).isValid()
        )
      ) {
        errors.birthdate = t('INVALID_FORMAT')
      } else if (moment(values.birthdate).isAfter(new Date(), 'days')) {
        errors.birthdate = t('INVALID_DATE')
      }
    }

    return errors
  }

  const handleSubmit = (values: FormValues) => {
    const userData = {
      email: values.email,
      password: values.password,
      full_name: values.full_name,
      custom_data: {
        address: values.address,
        gender: values.gender,
        birthdate: moment(values.birthdate).format(moment.HTML5_FMT.DATE),
      },
    }

    actions.createAccount(userData, () => {
      actions.emailLogin({
        email: values.email,
        password: values.password,
      })
    })
  }

  const registerForm = useForm<FormValues, FormErrors>({
    initialValues: {
      email: '',
      password: '',
      confirm_password: '',
      full_name: '',
      gender: '',
      birthdate: '',
      address: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  useEffect(
    () => () => {
      actions.clearAuthError()
    },
    [],
  )

  return {
    forms: { registerForm },
    data: {
      isOffLine,
      loading,
      error,
      location,
    },
  }
})
