import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useEffect } from 'react'
import { updateMyAccount } from '../../actionCreators'
import {
  authErrorSelector,
  authLoadingSelector,
  authMyAccountSelector,
} from '../../selectors'
import {
  createUseComponent,
  useActions,
  useForm,
  useLocalGoBack,
} from '../../hooks'
import { validateEmail, validateFullName } from '../../utils/validate'
import { formatFileSize } from '../../utils/file'
import { UpdateMyAccount } from '../../actions'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'

interface FormValues
  extends Pick<QBUser, 'full_name' | 'email' | 'password' | 'old_password'>,
    Pick<QBUserCustomData, 'description' | 'language'> {
  avatar?: QBUserCustomData['avatar'] | File
  confirm_password: QBUser['password']
}

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

const selector = createMapStateSelector({
  error: authErrorSelector,
  loading: authLoadingSelector,
  myAccount: authMyAccountSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const { myAccount } = store
  const actions = useActions({ updateMyAccount })

  const { t, i18n } = useTranslation()
  const isOffline = useIsOffLine()
  const onBack = useLocalGoBack()

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}
    const requiredFields: Array<keyof FormValues> = [
      'full_name',
      'email',
      'description',
      'language',
    ]
    const messageRequired = t('REQUIRED')

    requiredFields.forEach((name) => {
      if (!values[name]) errors[name] = messageRequired
    })

    if (!errors.avatar && values.avatar instanceof File) {
      if (!values.avatar.type.includes('image/')) {
        errors.avatar = t('INVALID_FORMAT')
      } else if (values.avatar.size > FILE_SIZE_LIMIT) {
        errors.avatar = t('FILE_SIZE_LIMIT', {
          size: formatFileSize(FILE_SIZE_LIMIT),
        })
      }
    }

    if (!errors.full_name && !validateFullName(values.full_name)) {
      errors.full_name = t('INVALID_FORMAT')
    }

    if (!errors.email && !validateEmail(values.email)) {
      errors.email = t('INVALID_FORMAT')
    }

    if (!errors.email && values.email.length > 100) {
      errors.email = t('MAX_LENGTH_CHAR', {
        count: 100,
      })
    }

    if ((values.password || values.confirm_password) && !values.old_password) {
      errors.old_password = messageRequired
    }

    if ((values.old_password || values.confirm_password) && !values.password) {
      errors.password = messageRequired
    }

    if (!errors.password && values.password) {
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

    if ((values.old_password || values.password) && !values.confirm_password) {
      errors.confirm_password = messageRequired
    }

    if (
      !errors.password &&
      !errors.old_password &&
      values.password &&
      values.old_password &&
      values.password === values.old_password
    ) {
      errors.password = t('PASSWORDS_MATCH')
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

    return errors
  }

  const handleSubmit = (values: FormValues) => {
    const userData: UpdateMyAccount = {
      full_name: values.full_name,
      email: values.email,
      custom_data: {
        avatar: values.avatar,
        description: values.description,
        language: values.language,
      },
    }

    if (values.password && values.old_password) {
      userData.password = values.password
      userData.old_password = values.old_password
    }

    if (values.language && i18n.language !== values.language) {
      i18n.changeLanguage(values.language)
    }
    actions.updateMyAccount(userData, onBack)
  }

  const profileForm = useForm<FormValues, FormErrors>({
    initialValues: {
      avatar: myAccount?.custom_data.avatar,
      full_name: myAccount?.full_name || '',
      email: myAccount?.email || '',
      description: myAccount?.custom_data.description || '',
      language: myAccount?.custom_data.language || i18n.language,
      password: '',
      old_password: '',
      confirm_password: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  const handleCancel = () => {
    profileForm.resetForm()
    onBack()
  }

  useEffect(() => {
    profileForm.reinitialize()
  }, [myAccount])

  return {
    forms: { profileForm },
    data: { isOffline },
    store,
    handlers: { onBack, handleCancel },
  }
})
