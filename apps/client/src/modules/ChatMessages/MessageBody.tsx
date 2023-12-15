import {
  useEffect,
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import QB, { QBChatMessage } from '@qc/quickblox'

import AttachSvg from '@qc/icons/media/attachment.svg'
import ImageLoader from '../../components/ImageLoader'
import { formatFileSize } from '../../utils/file'
import {
  getTranslate as getTranslateAction,
  showNotification as showNotificationAction,
} from '../../actionCreators'
import * as Types from '../../actions'
import Loader from '../../components/Loader'

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Español' },
  { value: 'Ukrainian', label: 'Українська' },
  { value: 'French', label: 'Français' },
  { value: 'Arabic', label: 'العربية' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Chinese', label: '中文' },
]

interface MessageBodyProps {
  message: QBChatMessage
  language?: string
  translatedMessage?: string
  isMine: boolean
  loading: boolean
  messagesContainerRef: RefObject<HTMLDivElement>
  showNotification: typeof showNotificationAction
  getTranslate: typeof getTranslateAction
}

function MessageLink({
  url,
  className,
  children,
}: {
  url?: string
  className?: string
  children: JSX.Element
}) {
  return url ? (
    <a
      href={url}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ) : (
    children
  )
}

export default function MessageBody(props: MessageBodyProps) {
  const {
    language,
    translatedMessage,
    message,
    loading,
    isMine,
    messagesContainerRef,
    getTranslate,
    showNotification,
  } = props
  const { t } = useTranslation()
  const translateButtonRef = useRef<HTMLButtonElement>(null)
  const [positionLangs, setPositionLangs] = useState<'top' | 'bottom'>('bottom')
  const [isShowLangs, setIsShowLangs] = useState(false)
  const [isShowOriginal, setIsShowOriginal] = useState(true)

  const handleClickToggleLangs = ({
    currentTarget,
  }: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { offsetTop = 0, offsetHeight = 0 } =
      currentTarget.parentElement || {}
    const { scrollTop = 0, clientHeight = 0 } =
      messagesContainerRef.current || {}

    setPositionLangs(
      offsetHeight > 326 || offsetTop + 350 > scrollTop + clientHeight
        ? 'top'
        : 'bottom',
    )
    setIsShowLangs((value) => !value)
  }

  const handleShowOriginal = () => {
    setIsShowOriginal(true)
  }

  const handleGetTranslate = (selectedLang: string) => {
    setIsShowLangs(false)

    if (selectedLang === language && translatedMessage) {
      setIsShowOriginal(false)
    } else {
      getTranslate(
        {
          language: selectedLang,
          dialogId: message.chat_dialog_id,
          messageId: message._id,
        },
        (action) => {
          if (action.type === Types.GET_TRANSLATE_FAILURE && action.error) {
            showNotification({
              duration: 3 * SECOND,
              id: Date.now().toString(),
              position: 'bottom-center',
              type: 'error',
              message: action.error,
            })
          } else {
            setIsShowOriginal(false)
          }
        },
      )
    }
  }

  const clickHandler: EventListener = (e) => {
    if (
      translateButtonRef.current &&
      e.target instanceof Node &&
      !translateButtonRef.current.contains(e.target)
    ) {
      setIsShowLangs(false)
    }
  }

  useEffect(() => {
    if (isShowLangs) {
      document.addEventListener('click', clickHandler)
    }

    return () => document.removeEventListener('click', clickHandler)
  }, [isShowLangs])

  if (message.attachments && message.attachments.length) {
    return (
      <>
        {message.attachments.map((attachment) => {
          const url = attachment.uid && QB.content.privateUrl(attachment.uid)

          if (attachment.type.includes('image')) {
            return (
              <MessageLink
                url={url}
                key={attachment.uid}
                className="body image-file"
              >
                <ImageLoader key={attachment.uid} src={url} />
              </MessageLink>
            )
          }

          if (attachment.type.includes('video')) {
            return (
              <div className="body video-file" key={attachment.uid}>
                <video controls playsInline src={url}>
                  <a href={url} download>
                    {t('Download')}
                  </a>
                </video>
              </div>
            )
          }

          if (attachment.type.includes('audio')) {
            return (
              <div className="body audio-file" key={attachment.uid}>
                <audio controls src={url}>
                  <a href={url} download>
                    {t('Download')}
                  </a>
                </audio>
              </div>
            )
          }

          return (
            <MessageLink url={url} key={attachment.uid} className="body file">
              <div>
                <AttachSvg className="icon download" />
                {attachment.name ? <div>{attachment.name}</div> : null}
                {attachment.size ? (
                  <div>{formatFileSize(attachment.size)}</div>
                ) : null}
              </div>
            </MessageLink>
          )
        })}
      </>
    )
  }

  return (
    <div className="message-body">
      <div
        className="body"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: (!translatedMessage || isShowOriginal
            ? message.message!
            : translatedMessage
          ).replace(
            /(https?:\/\/)?([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+)[\p{L}\p{N}.,@?^=%&:/~+#-]*[\p{L}\p{N}@?^=%&/~+#-])/gu,
            (url, protocol, path) =>
              `<a href="${
                protocol || typeof path !== 'string' ? url : `http://${path}`
              }" rel="noopener noreferrer" target="_blank">${url}</a>`,
          ),
        }}
      />
      {AI_TRANSLATE && !isMine && (
        <>
          <button
            type="button"
            disabled={loading}
            className="translate-btn"
            ref={translateButtonRef}
            onClick={
              !translatedMessage || isShowOriginal
                ? handleClickToggleLangs
                : handleShowOriginal
            }
          >
            {!translatedMessage || isShowOriginal
              ? t('ShowTranslation')
              : t('ShowOriginal')}
          </button>
          <div className="translate-container">
            <div
              className={cn('translate-langs', positionLangs, {
                open: isShowLangs,
              })}
            >
              <span className="translate-langs-label">{t('TranslateTo')}</span>
              <ul className="translate-langs-list">
                {languageOptions.map(({ label, value }, index) => (
                  <li
                    className="translate-langs-item"
                    key={index}
                    onClick={() => handleGetTranslate(value)}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {AI_TRANSLATE && !isMine && loading && (
        <span className="translate-loader">
          <Loader size={20} />
        </span>
      )}
    </div>
  )
}
