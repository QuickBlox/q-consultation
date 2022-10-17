import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { createUseComponent, useActions, useForm } from '../../hooks'
import useIsOffLine from '../../hooks/useIsOffLine'
import { validateEmail } from '../../utils/validate'
import { emailLogin, clearAuthError } from '../../actionCreators'
import { createMapStateSelector } from '../../utils/selectors'
import {
  authErrorSelector,
  authLoadingSelector,
  qbErrorSelector,
  qbLoadingSelector,
} from '../../selectors'

type FormValues = Required<Pick<QBUser, 'email' | 'password'>>

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
    emailLogin,
    clearAuthError,
  })
  const isOffLine = useIsOffLine()
  const location = useLocation<{ referrer?: string }>()
  const { qbLoading, authLoading, qbError, authError } = store

  const loading = qbLoading || authLoading
  const error = qbError || authError

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}
    const requiredFields: Array<keyof FormValues> = ['email', 'password']

    requiredFields.forEach((name) => {
      if (!values[name]) errors[name] = 'REQUIRED'
    })

    if (!errors.email && !validateEmail(values.email)) {
      errors.email = 'INVALID_FORMAT'
    }

    return errors
  }

  const handleSubmit = (values: FormValues) => {
    actions.emailLogin(values)
  }

  const loginForm = useForm<FormValues, FormErrors>({
    initialValues: {
      email: '',
      password: '',
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
    store,
    forms: { loginForm },
    data: {
      isOffLine,
      loading,
      error,
      location,
    },
  }
})
