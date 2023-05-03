import { useTranslation } from 'react-i18next'

import ImageLoader from '../../components/ImageLoader'
import { AttachSvg, RobotSvg } from '../../icons'
import {
  getQuickAnswer as getQuickAnswerAction,
  getQuickAnswerCancel,
} from '../../actionCreators'
import Loader from '../../components/Loader'

interface MessageBodyProps {
  message: QBChatMessage
  isMine: boolean
  loading: boolean
  setInputValue?: (value: string) => void
  getQuickAnswer: typeof getQuickAnswerAction
  cancelQuickAnswer: typeof getQuickAnswerCancel
}

export default function MessageBody(props: MessageBodyProps) {
  const {
    message,
    loading,
    isMine,
    setInputValue,
    getQuickAnswer,
    cancelQuickAnswer,
  } = props
  const { t } = useTranslation()

  const handleGetQuickAnswer = () => {
    cancelQuickAnswer()
    getQuickAnswer(message._id, message.message, (action) => {
      const answer = 'payload' in action ? action.payload.answer : null

      if (setInputValue && answer) {
        setInputValue(answer)
      }
    })
  }

  if (message.attachments && message.attachments.length) {
    return (
      <>
        {message.attachments.map((attachment) => {
          const url = attachment.uid && QB.content.privateUrl(attachment.uid)
          let element

          if (attachment.type.indexOf('image') > -1) {
            element = (
              <ImageLoader className="body" key={attachment.uid} src={url} />
            )
          } else if (attachment.type.indexOf('video') > -1) {
            element = (
              <video
                className="body"
                controls
                key={attachment.id}
                playsInline
                src={url}
              >
                <a href={url} download>
                  {t('Download')}
                </a>
              </video>
            )
          } else if (attachment.type.indexOf('audio') > -1) {
            element = (
              <audio className="body" controls key={attachment.id} src={url}>
                <a href={url} download>
                  {t('Download')}
                </a>
              </audio>
            )
          } else {
            element = (
              <a
                className="body"
                download
                href={url}
                key={attachment.uid}
                rel="noopener noreferrer"
                target="_blank"
              >
                <AttachSvg className="icon download" />
                {attachment.name ? <div>{attachment.name}</div> : null}
                {attachment.size ? <div>{attachment.size} bytes</div> : null}
                <div>{t('Download')}</div>
              </a>
            )
          }

          return element
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
          __html: message.message.replace(
            /(https?:\/\/)?([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+)[\p{L}\p{N}.,@?^=%&:/~+#-]*[\p{L}\p{N}@?^=%&/~+#-])/gu,
            (url, protocol, path) =>
              `<a href="${
                protocol || typeof path !== 'string' ? url : `http://${path}`
              }" rel="noopener noreferrer" target="_blank">${url}</a>`,
          ),
        }}
      />
      {AI_QUICK_ANSWER && !isMine && setInputValue && (
        <button
          type="button"
          disabled={loading}
          title={t('QuickAnswer')}
          className="ai-quick-answer"
          onClick={handleGetQuickAnswer}
        >
          {loading ? <Loader size={20} /> : <RobotSvg />}
        </button>
      )}
    </div>
  )
}
