import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import {
  MicSvg,
  CamSvg,
  ScreenshareSvg,
  SwitchCamSvg,
  ExitFullscreenSvg,
  FullscreenSvg,
  EndCallSvg,
} from '../../icons'
import { useMobileLayout } from '../../hooks'
import IS_MOBILE from '../../utils/isMobile'
import CameraModal from '../modals/CameraModal'
import useComponent, { CallControlsProps } from './useComponent'
import './styles.css'

export default function CallControls(props: CallControlsProps) {
  const {
    data: { fullscreenEnabled, fullscreen, cameraModalOpened, isOffline },
    store: { muteAudio, muteVideo, screenshare, session, videoInputSources },
    handlers: { toggleFullscreen, toggleSwitchCamera, closeCameraModal },
    actions: {
      toggleMuteAudio,
      toggleMuteVideo,
      toggleScreenSharing,
      stopCall,
    },
  } = useComponent(props)
  const { t } = useTranslation()
  const RESOLUTION_XS = useMobileLayout()

  return (
    <div className="controls">
      <button
        className={cn('control-btn', { active: muteAudio })}
        disabled={!session || isOffline}
        onClick={toggleMuteAudio}
        title={muteAudio ? t('Unmute') : t('Mute')}
        type="button"
      >
        <MicSvg className="icon" />
      </button>
      <button
        className={cn('control-btn', { active: muteVideo })}
        disabled={!session || isOffline}
        onClick={toggleMuteVideo}
        title={muteVideo ? t('TurnOnCam') : t('TurnOffCam')}
        type="button"
      >
        <CamSvg className="icon" />
      </button>
      {!IS_MOBILE && (
        <button
          className={cn('control-btn', { active: screenshare })}
          disabled={!session || isOffline}
          onClick={toggleScreenSharing}
          title={screenshare ? t('StopSharing') : t('ShareScreen')}
          type="button"
        >
          <ScreenshareSvg className="icon" />
        </button>
      )}
      {videoInputSources.length > 1 && (
        <button
          className={cn('control-btn', { active: muteVideo })}
          disabled={!session || muteVideo || isOffline}
          onClick={toggleSwitchCamera}
          title={t('SwitchCamera')}
          type="button"
        >
          <SwitchCamSvg className="icon" />
        </button>
      )}
      {fullscreenEnabled && (
        <button
          className={cn('control-btn', { active: fullscreen })}
          disabled={!session || isOffline}
          onClick={toggleFullscreen}
          title={fullscreen ? t('ExitFullscreen') : t('EnterFullscreen')}
          type="button"
        >
          {fullscreen ? (
            <ExitFullscreenSvg className="icon" />
          ) : (
            <FullscreenSvg className="icon" />
          )}
        </button>
      )}
      <button
        className="control-btn end-call"
        disabled={!session || isOffline}
        onClick={() => stopCall()}
        type="button"
      >
        {RESOLUTION_XS ? (
          <EndCallSvg className="icon" />
        ) : (
          <span>{t('EndCall')}</span>
        )}
      </button>
      {videoInputSources.length > 1 && (
        <CameraModal open={cameraModalOpened} onClose={closeCameraModal} />
      )}
    </div>
  )
}
