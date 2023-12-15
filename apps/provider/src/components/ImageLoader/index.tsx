import {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import cn from 'classnames'

import ImageSvg from '@qc/icons/media/image-filled.svg'
import './styles.css'

type ImageLoaderProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

// const LOAD_ERROR = 'Failed to load image'
const ANIMATION_DURATION = 250 // ms
const ANIMATION_STEPS = 20

function updateOpacity(
  value: number,
  config: { to: number; duration: number },
  updater: (newValue: number) => void,
  callback?: VoidFunction,
) {
  const initialValue = value
  let valueCopy = value
  const intervalId = setInterval(() => {
    if (valueCopy === config.to) {
      clearInterval(intervalId)

      if (callback) callback()
    } else {
      const newValue =
        config.to < initialValue
          ? Number((valueCopy - initialValue / ANIMATION_STEPS).toFixed(4))
          : Number((valueCopy + config.to / ANIMATION_STEPS).toFixed(4))

      updater(newValue)
      valueCopy = newValue
    }
  }, config.duration / ANIMATION_STEPS)

  return () => clearInterval(intervalId)
}

export default function ImageLoader(props: ImageLoaderProps) {
  const { className, height, width, style, ...imageProps } = props

  /**
   * TODO
   * Show spinner when image is loading
   * If image load failed - show error message
   * Hide spinner when image was loaded either successfully or not
   */
  // const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  // const [error, setError] = useState('')
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const [imageOpacity, setImageOpacity] = useState(0)
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1)

  // const onLoadStarted = () => setLoading(true)
  const onImageLoaded = () => {
    // setLoading(false)
    setLoaded(true)
  }
  // const onLoadError = () => {
  //   setLoading(false)
  //   setError(LOAD_ERROR)
  // }

  useEffect(() => {
    const timers: Array<VoidFunction> = []

    if (loaded) {
      timers.push(
        updateOpacity(
          imageOpacity,
          { to: 1, duration: ANIMATION_DURATION },
          setImageOpacity,
        ),
      )
      timers.push(
        updateOpacity(
          placeholderOpacity,
          { to: 0, duration: ANIMATION_DURATION },
          setPlaceholderOpacity,
          () => setShowPlaceholder(false),
        ),
      )
    } else {
      setShowPlaceholder(true)
      timers.push(
        updateOpacity(
          imageOpacity,
          { to: 0, duration: ANIMATION_DURATION },
          setImageOpacity,
        ),
      )
      timers.push(
        updateOpacity(
          placeholderOpacity,
          { to: 1, duration: ANIMATION_DURATION },
          setPlaceholderOpacity,
        ),
      )
    }

    return () => {
      while (timers.length) {
        const stop = timers.pop()

        if (stop) stop()
      }
    }
  }, [loaded])

  return (
    <div
      className={cn('image-loader', className)}
      style={{ height, width, ...style }}
    >
      <img
        loading="lazy"
        {...imageProps}
        // onLoadStart={onLoadStarted}
        onLoad={onImageLoaded}
        // onError={onLoadError}
        style={{ opacity: imageOpacity, transition: 'opacity 0.4s' }}
      />
      {showPlaceholder ? (
        <div className="placeholder" style={{ opacity: placeholderOpacity }}>
          <ImageSvg className="image" />
        </div>
      ) : null}
    </div>
  )
}
