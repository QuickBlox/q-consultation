import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Avatar from '../Avatar'
import Button from '../Button'
import Loader from '../Loader'
import useComponent, { AvatarUploadProps } from './useComponent'
import './styles.css'

export default function AvatarUpload(props: AvatarUploadProps) {
  const { className, value, loading, onDelete, ...inputProps } = props
  const {
    data: { uploading },
    handlers: { handleChange },
  } = useComponent(props)
  const { t } = useTranslation()
  const [avatarError, setAvatarError] = useState(false)

  const handleAvatarError = () => {
    setAvatarError(true)
  }

  const renderContent = () => {
    if (uploading || loading)
      return (
        <span className="avatar-upload-photo">
          <Loader />
        </span>
      )

    if (value && !avatarError)
      return (
        <Avatar
          blob={value}
          className="avatar-upload-photo"
          onError={handleAvatarError}
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
        onClick={onDelete}
        loading={loading || uploading}
        disabled={!value}
      >
        {t('RemovePhoto')}
      </Button>
    </div>
  )
}
