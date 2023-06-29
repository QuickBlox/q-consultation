import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'

import { createUseComponent, useActions, useForm } from '../../../hooks'
import { toggleShowModal, createUser } from '../../../actionCreators'
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
  submit?: 'send' | 'copy'
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
    createUser,
  })
  const { myAccount, opened } = store
  const backdrop = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [loadingField, setLoadingField] = useState<'copy-link' | null>(null)
  const isOffline = useIsOffLine()

  const handleCopy = async (values: FormValues) => {
    if (myAccount) {
      setLoadingField('copy-link')

      const linkPromise = new Promise<string>((resolve) => {
        actions.createUser(values.full_name, ({ session }) => {
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
      setLoadingField(null)
      setCopied(true)
      setTimeout(() => setCopied(false), 2.5 * SECOND)
    }
  }

  const handleSubmit = (values: FormValues) => {
    const submitActions = {
      send: () => {},
      copy: () => handleCopy(values),
    }

    if (values.submit) {
      submitActions[values.submit]()
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

  const onCancelClick = () => {
    guestUserForm.resetForm()
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
    data: { copied, loadingField, isOffline },
    handlers: {
      onCancelClick,
      onBackdropClick,
    },
  }
})
