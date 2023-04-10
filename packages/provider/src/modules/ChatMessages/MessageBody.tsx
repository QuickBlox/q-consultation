import { useTranslation } from 'react-i18next'

import ImageLoader from '../../components/ImageLoader'
import { AttachSvg } from '../../icons'

interface MessageBodyProps {
  message: QBChatMessage
}

export default function MessageBody({ message }: MessageBodyProps) {
  const { t } = useTranslation()

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
  )
}
