import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Avatar from '../Avatar'
import Button from '../Button'
import Loader from '../Loader'
import useComponent, { AvatarUploadProps } from './useComponent'
import './styles.css'

export default function AvatarUpload(props: AvatarUploadProps) {
  const { className, value, loading, ...inputProps } = props
  const {
    data: { uploading },
    handlers: { handleChange, handleDelete },
  } = useComponent(props)
  const { t } = useTranslation()

  const renderContent = () => {
    if (uploading || loading)
      return (
        <span className="avatar-upload-photo">
          <Loader />
        </span>
      )

    if (value)
      return (
        <Avatar
          url={
            value instanceof File
              ? URL.createObjectURL(value)
              : value.uid && QB.content.privateUrl(value.uid)
          }
          className="avatar-upload-photo"
        />
      )

    return <span className="avatar-upload-photo avatar-upload-plus" />
  }

  return (
    <div className={cn('avatar-upload', className)}>
      <label htmlFor={inputProps.id}>
        <input
          {...inputProps}
          type="file"
          autoComplete="photo"
          accept="image/*,image/heic"
          disabled={inputProps.disabled || loading || uploading}
          onChange={handleChange}
        />
        {renderContent()}
      </label>
      <Button
        className="avatar-upload-btn"
        onClick={handleDelete}
        loading={loading || uploading}
        disabled={!value}
      >
        {t('RemovePhoto')}
      </Button>
    </div>
  )
}
