import heic2any from 'heic2any'

export const fileConversion = async (file: File) => {
  const heicRegex = /\.hei(c|f)$/i

  if (heicRegex.test(file.name)) {
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
    })

    return new File(
      Array.isArray(blob) ? blob : [blob],
      file.name.replace(heicRegex, '.jpeg'),
      {
        type: 'image/jpeg',
      },
    )
  }

  return file
}

export const formatFileSize = (size: number) => {
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  const currentUnitIndex = Math.floor(Math.log(size) / Math.log(1024))

  return `${Math.round(size / 1024 ** currentUnitIndex)} ${
    units[currentUnitIndex]
  }`
}

export const isFileExtensionValid = (name: string) => {
  const extensionsWhitelist = FILE_EXTENSIONS_WHITELIST.split(' ')
  const [, extension] = /\.(\w+)$/.exec(name) || []

  return typeof extension === 'string'
    ? extensionsWhitelist.includes(extension.toLowerCase())
    : false
}
