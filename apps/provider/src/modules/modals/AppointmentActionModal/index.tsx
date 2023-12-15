import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import CloseSvg from '@qc/icons/navigation/close.svg'
import Button from '../../../components/Button'
import useComponent, { AppointmentActionModalProps } from './useComponent'
import './styles.css'

export default function AppointmentActionModal(
  props: AppointmentActionModalProps,
) {
  const {
    store: { opened, appointment },
    refs: { backdrop },
    data: { userName },
    handlers: {
      onBackdropClick,
      onCancelClick,
      skipAppointment,
      finishAppointment,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal choose', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">{userName}</div>
        <div className="body">
          <span className="label">{t('WhatDoYouWantToDo')}</span>
          <div className="btn-group">
            <Button
              size="lg"
              className="btn"
              disabled={!appointment}
              onClick={skipAppointment}
              theme="primary"
            >
              {t('RemoveFromQueue')}
            </Button>
            <Button
              size="lg"
              className="btn"
              disabled={!appointment}
              onClick={finishAppointment}
              theme="primary"
            >
              {t('FinishConsultation')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
