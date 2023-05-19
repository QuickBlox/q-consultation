import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import { AttachSvg, SendSvg } from '../../icons'
import useComponent, { ChatInputProps } from './useComponent'
import './styles.css'

export default function ChatInput(props: ChatInputProps) {
  const {
    refs: { texboxRef },
    data: { disableControls, isShowPlaceholder },
    handlers: {
      handleSendMessage,
      handleFileChange,
      handleKeyDown,
      handlePaste,
      handleInputFocus,
      handleInputMessage,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <footer className="input-container">
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
      <div className="textbox-field">
        <div
          contentEditable={!disableControls}
          tabIndex={0}
          className={cn('textbox-input', { disabled: disableControls })}
          role="textbox"
          ref={texboxRef}
          onInput={handleInputMessage}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        {isShowPlaceholder && (
          <span className="textbox-placeholder">{t('SendMessage')}</span>
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
