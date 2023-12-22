import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import AttachSvg from '@qc/icons/media/attachment.svg'
import RobotSvg from '@qc/icons/actions/ai.svg'
import SendSvg from '@qc/icons/actions/send.svg'
import Loader from '../../components/Loader'
import tones from '../../constants/tones'
import useComponent, { ChatInputProps } from './useComponent'
import './styles.css'

export default function ChatInput(props: ChatInputProps) {
  const { enableAttachments, enableRephrase } = props
  const {
    refs: { texboxRef, tonesRef },
    store: { rephraseLoading, originText },
    data: {
      disableControls,
      isShowPlaceholder,
      isShowTones,
      hasRephrasedText,
      height,
    },
    handlers: {
      handleSendMessage,
      handleFileChange,
      handleKeyDown,
      handlePaste,
      handleInputFocus,
      handleClickToggleTone,
      handleBackOriginal,
      handleRephrase,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <footer className="input-container">
      {enableAttachments && (
        <button className="attachment" disabled={disableControls} type="button">
          <label htmlFor="file">
            <input
              className="hidden"
              disabled={disableControls}
              id="file"
              onChange={handleFileChange}
              type="file"
              accept={FILE_EXTENSIONS_WHITELIST.split(' ')
                .map((extension) => `.${extension}`)
                .join(',')}
            />
            <AttachSvg className="icon" />
          </label>
        </button>
      )}
      <div className="textbox-field">
        <div
          contentEditable={!disableControls}
          tabIndex={0}
          className={cn('textbox-input', {
            disabled: disableControls,
            'with-ai': enableRephrase,
          })}
          role="textbox"
          ref={texboxRef}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        {isShowPlaceholder && (
          <span className="textbox-placeholder">{t('YourMessage')}</span>
        )}
        {enableRephrase && (
          <div ref={tonesRef} className="rephrase-container">
            <ul
              className={cn('rephrase-tones', {
                open: isShowTones,
                adaptive: height < 775,
              })}
            >
              {hasRephrasedText &&
                originText !== texboxRef.current?.innerText && (
                  <li
                    className="rephrase-tones-item"
                    onClick={handleBackOriginal}
                  >
                    {`✅ ${t('Back to original text')}`}
                  </li>
                )}
              {tones.map(({ name, iconEmoji }, index) => (
                <li
                  key={index}
                  className="rephrase-tones-item"
                  onClick={() => handleRephrase(name)}
                >
                  {`${iconEmoji} ${t(name)}`}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={isShowPlaceholder || rephraseLoading}
              title={t('Rephrase')}
              className={cn('rephrase-btn', { inactive: isShowPlaceholder })}
              onClick={handleClickToggleTone}
            >
              {rephraseLoading ? <Loader size={20} /> : <RobotSvg />}
            </button>
          </div>
        )}
      </div>
      <button
        className="send"
        disabled={disableControls}
        onClick={handleSendMessage}
        type="button"
      >
        <SendSvg className="icon" />
      </button>
    </footer>
  )
}
