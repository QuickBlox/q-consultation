import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import UserSelect from '../../UserSelect'
import Button from '../../../components/Button'
import { CloseSvg } from '../../../icons'
import useComponent, { AssignModalProps } from './useComponent'
import FormField from '../../../components/FormField'

export default function AssignModal(props: AssignModalProps) {
  const {
    store: { opened, loading },
    refs: { backdrop },
    data: { userName, value },
    handlers: {
      onBackdropClick,
      onCancelClick,
      reAssignAppointment,
      setValue,
      filterWithoutCurrentUser,
    },
  } = useComponent(props)
  const { t } = useTranslation()

  return (
    <div
      className={cn('modal assign', { active: opened })}
      onClick={onBackdropClick}
      ref={backdrop}
    >
      <CloseSvg className="icon-close" onClick={onCancelClick} />
      <div className="form">
        <div className="title">{t('AssignToName', { name: userName })}</div>
        <div className="body">
          <FormField htmlFor="agent_id" label={t('ChooseAgent')}>
            <UserSelect
              inputId="agent_id"
              value={value?.id}
              userTag="provider"
              filter={filterWithoutCurrentUser}
              onChange={setValue}
            />
          </FormField>
          <div className="btn-group">
            <Button
              size="xl"
              className="btn"
              loading={loading}
              disabled={!value}
              onClick={reAssignAppointment}
              theme="primary"
            >
              {t('Assign')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
