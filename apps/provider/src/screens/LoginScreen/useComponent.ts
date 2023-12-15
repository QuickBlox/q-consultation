import { useSelector } from 'react-redux'

import { QBUser } from '@qc/quickblox'
import { login } from '../../actionCreators'
import { createUseComponent, useActions, useForm } from '../../hooks'
import {
  authErrorSelector,
  authLoadingSelector,
  qbErrorSelector,
  qbLoadingSelector,
} from '../../selectors'
import { createMapStateSelector } from '../../utils/selectors'
import { validateEmail } from '../../utils/validate'
import useIsOffLine from '../../hooks/useIsOffLine'

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
    login,
  })
  const { qbLoading, authLoading, qbError, authError } = store
  const loading = qbLoading || authLoading
  const error = qbError || authError

  const isOffLine = useIsOffLine()

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
    actions.login(values)
  }

  const loginForm = useForm<FormValues, FormErrors>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  return {
    store,
    actions,
    forms: { loginForm },
    data: {
      isOffLine,
      error,
      loading,
      isCompletedForm: Boolean(
        loginForm.values.email && loginForm.values.password,
      ),
    },
  }
})
