import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import {
  updateMyAccount,
  toggleShowModal,
  getUser,
  clearAuthError,
} from '../../actionCreators'
import {
  authLoadingSelector,
  authMyAccountSelector,
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

type FormValuesPhone = Pick<QBUser, 'full_name' | 'phone'> &
  Pick<QBUserCustomData, 'address' | 'language' | 'gender'>

interface FormValuesEmail
  extends Pick<QBUser, 'full_name' | 'email' | 'password' | 'old_password'>,
    Pick<QBUserCustomData, 'address' | 'language' | 'gender'> {
  confirm_password: QBUser['password']
}

interface FormValues extends FormValuesPhone, FormValuesEmail {
  avatar?: QBUserCustomData['avatar'] | File
  birthdate: QBUserCustomData['birthdate'] | Date
}

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

const selector = createMapStateSelector({
  authLoading: authLoadingSelector,
  usersLoading: usersLoadingSelector,
  myAccount: authMyAccountSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const { myAccount, authLoading, usersLoading } = store
  const actions = useActions({
    updateMyAccount,
    toggleShowModal,
    getUser,
    clearAuthError,
  })

  const { t, i18n } = useTranslation()
  const isOffline = useIsOffLine()
  const onBack = useLocalGoBack()
  const [phoneError, setPhoneError] = useState('')

  const loading = authLoading || usersLoading

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

    if (!errors.birthdate && values.birthdate) {
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
    const userData: UpdateMyAccount = {
      full_name: values.full_name,
      email: values.email,
      phone: values.phone.replace('+', ''),
      login: values.phone.replace('+', ''),
      custom_data: {
        avatar: values.avatar,
        address: values.address,
        gender: values.gender,
        language: values.language,
        birthdate: moment(values.birthdate).format(moment.HTML5_FMT.DATE),
      },
      tag_list: myAccount?.user_tags?.split(','),
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
      avatar: myAccount?.custom_data?.avatar,
      full_name: myAccount?.full_name || '',
      email: myAccount?.email || '',
      address: myAccount?.custom_data?.address || '',
      birthdate:
        myAccount?.custom_data?.birthdate &&
        moment(myAccount.custom_data?.birthdate).isValid()
          ? moment(myAccount.custom_data?.birthdate).toDate()
          : myAccount?.custom_data?.birthdate,
      phone: myAccount?.phone ? `+${myAccount?.phone}` : '',
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
    setPhoneError('')
  }, [profileForm.values.phone])

  useEffect(() => {
    profileForm.reinitialize()
  }, [myAccount])

  useEffect(
    () => () => {
      actions.clearAuthError()
    },
    [],
  )

  return {
    data: { isOffline, phoneError, loading },
    forms: { profileForm },
    store,
    handlers: {
      onBack,
      handleCancel,
    },
  }
})
