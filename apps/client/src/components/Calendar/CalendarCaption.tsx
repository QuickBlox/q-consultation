import { CaptionProps, useNavigation } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import format from 'date-fns/format'
import ChevronRightSvg from '@qc/icons/navigation/next.svg'
import { dayPickerLocale } from '../../utils/locales'

export function CalendarCaption({ displayMonth }: CaptionProps) {
  const { previousMonth, nextMonth, goToMonth } = useNavigation()
  const { i18n } = useTranslation()

  return (
    <div className="rdp-nav">
      <button
        type="button"
        className="rdp-nav_button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <ChevronRightSvg className="nav-icon nav-icon-prev" />
      </button>
      <span className="rdp-caption_label">
        {format(displayMonth, 'MMMM, yyyy', {
          locale: dayPickerLocale[i18n.language],
        })}
      </span>
      <button
        type="button"
        className="rdp-nav_button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <ChevronRightSvg className="nav-icon nav-icon-next" />
      </button>
    </div>
  )
}
