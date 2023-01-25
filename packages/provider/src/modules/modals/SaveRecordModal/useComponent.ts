import { MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { toggleShowModal } from '../../../actionCreators'
import { modalFileSelector, modalSaveRecordSelector } from '../../../selectors'
import { createUseComponent, useActions, useForm } from '../../../hooks'
import { createMapStateSelector } from '../../../utils/selectors'

export interface SaveRecordModalProps {
  onClose?: () => void
}

interface FormValues {
  filename: string
}

type FormErrors = Partial<DictionaryByKey<FormValues, string>>

const selector = createMapStateSelector({
  opened: modalSaveRecordSelector,
  file: modalFileSelector,
})

export default createUseComponent((props: SaveRecordModalProps) => {
  const { onClose } = props
  const store = useSelector(selector)
  const actions = useActions({
    toggleShowModal,
  })
  const backdrop = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { file } = store

  const handleCancel = () => {
    actions.toggleShowModal({ modal: 'SaveRecordModal' })

    if (onClose) {
      onClose()
    }
  }

  const onBackdropClick = (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdrop.current && e.target === backdrop.current) {
      handleCancel()
    }
  }

  const handleValidate = (values: FormValues) => {
    const errors: FormErrors = {}

    if (!values.filename) {
      errors.filename = t('REQUIRED')
    } else if (!/.+(.webm)$/i.test(values.filename)) {
      errors.filename = t('INVALID_FILE', {
        extensions: '.webm',
      })
    }

    return errors
  }

  const handleSubmit = (values: FormValues) => {
    const link = document.createElement('a')

    link.download = values.filename
    link.href = URL.createObjectURL(file as Blob)
    link.onclick = () => {
      setTimeout(() => URL.revokeObjectURL(link.href), 30 * 1000)
    }
    link.click()
    handleCancel()
  }

  const fileForm = useForm<FormValues, FormErrors>({
    initialValues: {
      filename: file?.name || '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    fileForm.reinitialize()
  }, [file])

  return {
    store,
    actions,
    forms: { fileForm },
    refs: { backdrop },
    handlers: {
      onBackdropClick,
      handleCancel,
    },
  }
})
