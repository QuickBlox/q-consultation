import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
} from 'react'
import { createUseComponent } from '../../hooks'
import { fileConversion } from '../../utils/file'

type HTMLInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export interface AvatarUploadProps
  extends Omit<HTMLInputProps, 'type' | 'value' | 'onChange'> {
  onChange: (file?: File) => void
  value?: QBUserCustomData['avatar'] | File
  loading: boolean
}

export default createUseComponent((props: AvatarUploadProps) => {
  const { onChange } = props
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setUploading(true)
    const file = e.target.files.item(0)

    if (file) {
      const newFile = await fileConversion(file)

      onChange(newFile)
      setUploading(false)
    }
    e.target.value = ''
  }

  const handleDelete = () => {
    onChange(undefined)
  }

  return {
    data: { uploading },
    handlers: {
      handleChange,
      handleDelete,
    },
  }
})
