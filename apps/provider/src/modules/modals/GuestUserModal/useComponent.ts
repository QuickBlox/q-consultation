import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { createUseComponent, useActions, useForm } from '../../../hooks'
import {
  toggleShowModal,
  createGuestClient,
  showNotification,
} from '../../../actionCreators'
import {
  authMyAccountSelector,
  modalGuestUserSelector,
} from '../../../selectors'
import { createMapStateSelector } from '../../../utils/selectors'
import useIsOffLine from '../../../hooks/useIsOffLine'
import { validateFullName } from '../../../utils/validate'
import { APPOINTMENT_CLIENT_ROUTE } from '../../../constants/routes'

interface FormValues {
  full_name: QBUser['full_name']
}

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

export interface GuestUserModalProps {
  onClose?: () => void
}

const selector = createMapStateSelector({
  myAccount: authMyAccountSelector,
  opened: modalGuestUserSelector,
})

export default createUseComponent((props: GuestUserModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
    createGuestClient,
    showNotification,
  })
  const { myAccount, opened } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isOffline = useIsOffLine()
  const { t } = useTranslation()

  const onCancelClick = () => {
    actions.toggleShowModal({ modal: 'GuestUserModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      onCancelClick()
    }
  }

  const handleSubmit = async (values: FormValues) => {
    if (myAccount) {
      setIsLoading(true)

      const linkPromise = new Promise<string>((resolve) => {
        actions.createGuestClient(values.full_name, ({ session }) => {
          const query = new URLSearchParams()

          query.append('token', session.token)
          query.append('provider', myAccount.id.toString())
          const appointmentLink = `${APPOINTMENT_CLIENT_ROUTE}?${query.toString()}`

          resolve(appointmentLink)
        })
      })

      if (typeof ClipboardItem === 'function') {
        const textLink = new ClipboardItem({
          'text/plain': linkPromise.then(
            (text) => new Blob([text], { type: 'text/plain' }),
          ),
        })

        await navigator.clipboard.write([textLink])
      } else {
        const link = await linkPromise

        await navigator.clipboard.writeText(link)
      }
      setIsLoading(false)
      onCancelClick()
      actions.showNotification({
        duration: 3 * SECOND,
        id: Date.now().toString(),
        message: t('CopiedGuestLink', { name: values.full_name }),
        position: 'top-center',
        type: 'cancel',
      })
    }
  }

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}
    const requiredFields: Array<keyof FormValues> = ['full_name']

    requiredFields.forEach((name) => {
      if (!values[name]) errors[name] = 'REQUIRED'
    })

    if (!errors.full_name && !validateFullName(values.full_name)) {
      errors.full_name = 'INVALID_FORMAT'
    }

    return errors
  }

  const guestUserForm = useForm<FormValues, FormErrors>({
    initialValues: {
      full_name: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (!opened) {
      guestUserForm.reinitialize()
    }
  }, [opened])

  return {
    store,
    actions,
    forms: { guestUserForm },
    refs: { backdrop },
    data: { isLoading, isOffline },
    handlers: {
      onCancelClick,
      onBackdropClick,
    },
  }
})
