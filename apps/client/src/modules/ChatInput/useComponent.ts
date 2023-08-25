import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
  ClipboardEvent,
} from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { sendMessage, uploadFile, showNotification } from '../../actionCreators'
import {
  chatConnectedSelector,
  createDialogsByIdSelector,
} from '../../selectors'
import { createUseComponent, useActions, useMobileLayout } from '../../hooks'
import { QBContentUploadSuccessAction } from '../../actions'
import { formatFileSize, isFileExtensionValid } from '../../utils/file'
import { createMapStateSelector } from '../../utils/selectors'
import IS_MOBILE from '../../utils/isMobile'

export interface ChatInputProps {
  dialogId?: QBChatDialog['_id']
}

const createSelector = (dialogId?: QBChatDialog['_id']) =>
  createMapStateSelector({
    connected: chatConnectedSelector,
    currentDialog: createDialogsByIdSelector(dialogId),
  })

export default createUseComponent((props: ChatInputProps) => {
  const { dialogId } = props
  const selector = createSelector(dialogId)
  const store = useSelector(selector)
  const actions = useActions({
    sendMessage,
    uploadFile,
    showNotification,
  })
  const { t } = useTranslation()
  const { connected, currentDialog } = store
  const texboxRef = useRef<HTMLDivElement>(null)
  const [messageBody, setMessageBody] = useState<string | null>(null)
  const RESOLUTION_XS = useMobileLayout()

  const disableControls = !currentDialog?.joined || !connected

  const submitMessage = (attachment?: ChatMessageAttachment) => {
    if (dialogId && (messageBody?.trim().length || attachment)) {
      const message: QBChatNewMessage = {
        type: 'groupchat',
        body: messageBody?.trim() || '',
        extension: {
          save_to_history: 1,
          dialog_id: dialogId,
        },
        markable: 1,
      }

      if (attachment) {
        message.extension.attachments = [attachment]
      }
      actions.sendMessage({
        dialogId: QB.chat.helpers.getRoomJidFromDialogId(dialogId),
        message,
      })
      setMessageBody('')

      if (texboxRef.current) {
        texboxRef.current.innerText = ''
      }
    }
  }

  const handleChangeMessage = ({
    currentTarget,
  }: FormEvent<HTMLDivElement>) => {
    setMessageBody(currentTarget.outerText)
  }

  const handleSendMessage = () => submitMessage()

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    const text = event.clipboardData.getData('text/plain')

    const range = document.getSelection()?.getRangeAt(0)

    if (range) {
      range.deleteContents()

      const textNode = document.createTextNode(text)

      range.insertNode(textNode)
      range.selectNodeContents(textNode)
      range.collapse(false)

      const selection = window.getSelection()

      selection?.removeAllRanges()
      selection?.addRange(range)

      if (texboxRef.current?.innerText) {
        setMessageBody(texboxRef.current?.innerText)
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (IS_MOBILE) return

    if (texboxRef.current && event.key === 'Enter') {
      event.preventDefault()

      if (event.altKey || event.ctrlKey || event.shiftKey) {
        document.execCommand('insertLineBreak')
      } else {
        submitMessage()
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)

    if (!file) return

    if (!isFileExtensionValid(file.name)) {
      actions.showNotification({
        duration: 3 * SECOND,
        id: Date.now().toString(),
        position: 'bottom-center',
        type: 'error',
        message: t('INVALID_FILE', {
          extensions: FILE_EXTENSIONS_WHITELIST.split(' ').join(', '),
        }),
      })
    } else if (file.size > FILE_SIZE_LIMIT) {
      actions.showNotification({
        duration: 3 * SECOND,
        id: Date.now().toString(),
        position: 'bottom-center',
        type: 'error',
        message: t('FILE_SIZE_LIMIT', {
          size: formatFileSize(FILE_SIZE_LIMIT),
        }),
      })
    } else {
      actions.uploadFile(file, (action: QBContentUploadSuccessAction) => {
        const { id, name, size, uid, content_type } = action.payload
        const type = content_type.replace(/(\/.*)$/, '')

        submitMessage({ id, name, size, type, uid })
      })
    }
    e.target.value = ''
  }

  const handleInputFocus = () => {
    // TODO: Workaround. Remove after Safari fixes the height of the workspace with the keyboard active.
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      })
    }, 150)
  }

  return {
    store,
    actions,
    refs: { texboxRef },
    data: { disableControls, messageBody, RESOLUTION_XS },
    handlers: {
      handleChangeMessage,
      handleSendMessage,
      handleKeyDown,
      handlePaste,
      handleFileChange,
      handleInputFocus,
    },
  }
})
