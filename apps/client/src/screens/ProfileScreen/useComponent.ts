import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  isMatch,
  isAfter,
  startOfDay,
  parseISO,
  format,
  isValid,
  parse,
} from 'date-fns'
import { QBUser, QBUserCustomData } from '@qc/quickblox'

import {
  updateMyAccount,
  toggleShowModal,
  getUser,
  clearAuthError,
  showNotification,
  getMyAvatar,
  setMyAvatar,
  deleteMyAvatar,
} from '../../actionCreators'
import {
  authErrorSelector,
  authLoadingSelector,
  authMyAccountSelector,
  avatarMySelector,
  usersLoadingSelector,
} from '../../selectors'
import {
  createUseComponent,
  useActions,
  useForm,
  useLocalGoBack,
} from '../../hooks'
import { formatFileSize } from '../../utils/file'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import { validateEmail, validateFullName } from '../../utils/validate'
import { UpdateMyAccount } from '../../actions'

interface FormValuesEmail
  extends Pick<QBUser, 'full_name' | 'email' | 'password' | 'old_password'>,
    Pick<QBUserCustomData, 'address' | 'language' | 'gender'> {
  confirm_password: QBUser['password']
}

interface FormValues extends FormValuesEmail {
  birthdate: QBUserCustomData['birthdate'] | Date
}

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

const selector = createMapStateSelector({
  error: authErrorSelector,
  authLoading: authLoadingSelector,
  usersLoading: usersLoadingSelector,
  myAccount: authMyAccountSelector,
  myAvatar: avatarMySelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const { myAccount, authLoading, usersLoading, myAvatar } = store
  const actions = useActions({
    updateMyAccount,
    toggleShowModal,
    getUser,
    clearAuthError,
    showNotification,
    getMyAvatar,
    setMyAvatar,
    deleteMyAvatar,
  })

  const { t, i18n } = useTranslation()
  const isOffline = useIsOffLine()
  const onBack = useLocalGoBack()

  const loading = authLoading || usersLoading

  const handleUploadAvatar = (avatar?: File) => {
    if (!avatar) return

    if (!avatar.type.includes('image/')) {
      actions.showNotification({
        duration: 3 * SECOND,
        id: Date.now().toString(),
        position: 'top-center',
        type: 'error',
        message: 'INVALID_FORMAT',
        translate: true,
      })
    } else if (avatar.size > FILE_SIZE_LIMIT) {
      actions.showNotification({
        duration: 3 * SECOND,
        id: Date.now().toString(),
        position: 'top-center',
        type: 'error',
        message: 'FILE_SIZE_LIMIT',
        translate: true,
        translateOptions: {
          size: formatFileSize(FILE_SIZE_LIMIT),
        },
      })
    } else {
      actions.setMyAvatar(avatar, (action) => {
        if ('error' in action) {
          actions.showNotification({
            duration: 3 * SECOND,
            id: Date.now().toString(),
            position: 'top-center',
            type: 'error',
            message: 'UploadFailed',
            translate: true,
          })
        } else {
          actions.showNotification({
            duration: 3 * SECOND,
            id: Date.now().toString(),
            position: 'top-center',
            type: 'success',
            message: 'UploadSuccessful',
            translate: true,
          })
        }
      })
    }
  }

  const handleDeleteAvatar = () => {
    actions.deleteMyAvatar((action) => {
      if ('error' in action) {
        actions.showNotification({
          duration: 3 * SECOND,
          id: Date.now().toString(),
          position: 'top-center',
          type: 'error',
          message: 'DeletionFailed',
          translate: true,
        })
      } else {
        actions.showNotification({
          duration: 3 * SECOND,
          id: Date.now().toString(),
          position: 'top-center',
          type: 'success',
          message: 'DeleteSuccessfully',
          translate: true,
        })
      }
    })
  }

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}
    const requiredFields: Array<keyof FormValues> = [
      'full_name',
      'email',
      'gender',
      'birthdate',
    ]
    const messageRequired = t('REQUIRED')

    requiredFields.forEach((name) => {
      if (!values[name]) errors[name] = t('REQUIRED')
    })

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
        errors.password = t('MIN_LENGTH_CHAR', { count: 8 })
      }

      if (values.password.length > 50) {
        errors.password = t('MAX_LENGTH_CHAR', { count: 50 })
      }
    }

    if ((values.old_password || values.password) && !values.confirm_password) {
      errors.confirm_password = messageRequired
    }

    if (
      !myAccount?.user_tags?.includes('guest') &&
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

    if (!errors.birthdate && values.birthdate) {
      if (
        !(
          values.birthdate instanceof Date ||
          isMatch(values.birthdate, 'yyyy-MM-dd')
        )
      ) {
        errors.birthdate = t('INVALID_FORMAT')
      } else if (
        isAfter(
          startOfDay(
            values.birthdate instanceof Date
              ? values.birthdate
              : parse(values.birthdate, 'yyyy-MM-dd', new Date()),
          ),
          startOfDay(new Date()),
        )
      ) {
        errors.birthdate = t('INVALID_DATE')
      }
    }

    return errors
  }

  const handleSubmit = (values: FormValues) => {
    const userData: UpdateMyAccount = {
      full_name: values.full_name,
      email: values.email,
      address: values.address,
      gender: values.gender,
      language: values.language,
      birthdate:
        values.birthdate instanceof Date
          ? format(values.birthdate, 'yyyy-MM-dd')
          : values.birthdate,
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
      full_name: myAccount?.full_name || '',
      email: myAccount?.email || '',
      address: myAccount?.custom_data?.address || '',
      birthdate:
        myAccount?.custom_data?.birthdate &&
        isValid(myAccount.custom_data?.birthdate)
          ? parseISO(myAccount.custom_data?.birthdate)
          : myAccount?.custom_data?.birthdate,
      gender: myAccount?.custom_data?.gender || '',
      language: myAccount?.custom_data?.language || i18n.language,
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

  useEffect(() => {
    if (!myAvatar) {
      actions.getMyAvatar()
    }
  }, [myAvatar])

  useEffect(
    () => () => {
      actions.clearAuthError()
    },
    [],
  )

  return {
    data: { isOffline, loading },
    forms: { profileForm },
    store,
    handlers: {
      onBack,
      handleCancel,
      handleUploadAvatar,
      handleDeleteAvatar,
    },
  }
})
