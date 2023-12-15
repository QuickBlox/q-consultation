import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import BackSvg from '@qc/icons/navigation/arrow-left.svg'
import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import { TextAreaField } from '../../../components/Field'
import useComponent, { EditNotesModalProps } from './useComponent'
import './styles.css'

export default function EditNotesModal(props: EditNotesModalProps) {
  const {
    store: { opened },
    refs: { backdrop },
    data: { notes, isOffline },
    handlers: {
      handleBackdropClick,
      handleChangeNotes,
      handleSubmit,
      onCancelClick,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal edit-notes', { active: opened })}
      onClick={handleBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="body">
          <div className="edit-notes-header">
            <button className="back" type="button" onClick={onCancelClick}>
              <BackSvg className="icon" />
            </button>
            <label htmlFor="notes" className="form-field-label">
              {t('Notes')}
            </label>
          </div>
          <div className="edit-notes-body">
            <div className="form-field">
              <TextAreaField
                id="notes"
                name="notes"
                className="form-field-input"
                onChange={handleChangeNotes}
                value={notes}
                rows={8}
              />
            </div>
            <div className="btn-group">
              <Button
                mobileSize="auto"
                className="btn"
                onClick={handleSubmit}
                theme="primary"
                disabled={isOffline}
              >
                {t('Save')}
              </Button>
              <Button mobileSize="auto" className="btn" onClick={onCancelClick}>
                {t('Cancel')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
