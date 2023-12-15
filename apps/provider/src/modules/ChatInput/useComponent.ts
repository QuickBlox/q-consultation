import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  ClipboardEvent,
  RefObject,
  useState,
  useRef,
} from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import QB, {
  QBChatDialog,
  ChatMessageAttachment,
  QBChatNewMessage,
} from '@qc/quickblox'
import {
  sendMessage,
  uploadFile,
  showNotification,
  rephrase,
} from '../../actionCreators'
import * as Types from '../../actions'
import {
  chatConnectedSelector,
  createDialogsByIdSelector,
  rephraseDialogIdSelector,
  rephraseLoadingSelector,
  rephraseOriginalTextSelector,
  rephraseRephrasedTextSelector,
} from '../../selectors'
import { createUseComponent, useActions, useScreenHeight } from '../../hooks'
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
    rephraseDialogId: rephraseDialogIdSelector,
    originText: rephraseOriginalTextSelector,
    rephrasedText: rephraseRephrasedTextSelector,
    rephraseLoading: rephraseLoadingSelector,
  })

export default createUseComponent((props: ChatInputProps) => {
  const { dialogId, texboxRef } = props
  const selector = createSelector(dialogId)
  const store = useSelector(selector)
  const actions = useActions({
    sendMessage,
    uploadFile,
    showNotification,
    rephrase,
  })
  const tonesRef = useRef<HTMLDivElement>(null)
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true)
  const [isShowTones, setIsShowPones] = useState(false)
  const height = useScreenHeight()
  const { t } = useTranslation()
  const {
    connected,
    currentDialog,
    rephraseDialogId,
    rephrasedText,
    originText,
    rephraseLoading,
  } = store

  const disableControls =
    !currentDialog?.joined || !connected || rephraseLoading
  const hasRephrasedText =
    currentDialog?._id === rephraseDialogId && Boolean(rephrasedText)

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
      actions.uploadFile(
        file,
        'chat',
        (action: QBContentUploadSuccessAction) => {
          const { id, name, size, uid, content_type } = action.payload
          const type = content_type.replace(/(\/.*)$/, '')

          submitMessage({ id, name, size, type, uid })
        },
      )
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

  const handleRephrase = (tone: string) => {
    const messageBody = texboxRef.current?.innerText

    setIsShowPones(false)

    if (currentDialog?._id && messageBody) {
      actions.rephrase(
        {
          dialogId: currentDialog._id,
          tone,
          text:
            originText && rephrasedText === messageBody
              ? originText
              : messageBody,
        },
        (action) => {
          if (
            texboxRef.current &&
            action.type === Types.REPHRASE_SUCCESS &&
            action.payload?.rephrasedText
          ) {
            texboxRef.current.innerText = action.payload.rephrasedText
          } else if (action.type === Types.REPHRASE_FAILURE && action.error) {
            actions.showNotification({
              duration: 3 * SECOND,
              id: Date.now().toString(),
              position: 'bottom-center',
              type: 'error',
              message: action.error,
            })
          }
        },
      )
    }
  }

  const handleClickToggleTone = () => {
    setIsShowPones((value) => !value)
  }

  const handleBackOriginal = () => {
    if (texboxRef.current) {
      texboxRef.current.innerText = originText
    }
    setIsShowPones(false)
  }

  const clickHandler: EventListener = (e) => {
    if (
      tonesRef.current &&
      e.target instanceof Node &&
      !tonesRef.current.contains(e.target)
    ) {
      setIsShowPones(false)
    }
  }

  useEffect(() => {
    if (isShowTones) {
      document.addEventListener('click', clickHandler)
    }

    return () => document.removeEventListener('click', clickHandler)
  }, [isShowTones])

  return {
    store,
    actions,
    refs: { texboxRef, tonesRef },
    data: {
      disableControls,
      isShowPlaceholder,
      isShowTones,
      hasRephrasedText,
      height,
    },
    handlers: {
      handleSendMessage,
      handleKeyDown,
      handlePaste,
      handleFileChange,
      handleInputFocus,
      handleClickToggleTone,
      handleBackOriginal,
      handleRephrase,
    },
  }
})
