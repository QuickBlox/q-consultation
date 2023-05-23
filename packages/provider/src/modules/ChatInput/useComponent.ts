import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  ClipboardEvent,
  RefObject,
  useState,
  FormEvent,
} from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { sendMessage, uploadFile, showNotification } from '../../actionCreators'
import {
  chatConnectedSelector,
  createDialogsByIdSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { QBContentUploadSuccessAction } from '../../actions'
import { formatFileSize, isFileExtensionValid } from '../../utils/file'
import { createMapStateSelector } from '../../utils/selectors'
import IS_MOBILE from '../../utils/isMobile'

export interface ChatInputProps {
  dialogId?: QBChatDialog['_id']
  texboxRef: RefObject<HTMLDivElement>
}

const createSelector = (dialogId?: QBChatDialog['_id']) =>
  createMapStateSelector({
    connected: chatConnectedSelector,
    currentDialog: createDialogsByIdSelector(dialogId),
  })

export default createUseComponent((props: ChatInputProps) => {
  const { dialogId, texboxRef } = props
  const selector = createSelector(dialogId)
  const store = useSelector(selector)
  const actions = useActions({
    sendMessage,
    uploadFile,
    showNotification,
  })
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true)
  const { t } = useTranslation()
  const { connected, currentDialog } = store

  const disableControls = !currentDialog?.joined || !connected

  const submitMessage = (attachment?: ChatMessageAttachment) => {
    const messageBody = texboxRef.current?.innerText || ''

    if (dialogId && (messageBody?.trim().length || attachment)) {
      const message: QBChatNewMessage = {
        type: 'groupchat',
        body: messageBody?.trim(),
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

      if (texboxRef.current) {
        texboxRef.current.innerText = ''
      }
    }
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

  useEffect(() => {
    if (texboxRef.current) {
      texboxRef.current.innerText = ''
    }
  }, [dialogId])

  useEffect(() => {
    if (texboxRef.current) {
      const observer = new MutationObserver(([event]) => {
        const { target } = event

        if (target instanceof HTMLDivElement) {
          setIsShowPlaceholder(!target.outerText.replace(/^\n/, '').length)
        }
      })

      observer.observe(texboxRef.current, {
        characterData: false,
        childList: true,
        attributes: false,
      })
    }
  }, [])

  return {
    store,
    actions,
    refs: { texboxRef },
    data: { disableControls, isShowPlaceholder },
    handlers: {
      handleSendMessage,
      handleKeyDown,
      handlePaste,
      handleFileChange,
      handleInputFocus,
    },
  }
})
