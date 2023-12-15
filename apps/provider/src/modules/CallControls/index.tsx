import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import ScreenshareSvg from '@qc/icons/toggle/screenshare.svg'
import EndCallSvg from '@qc/icons/actions/hungup.svg'
import FullscreenSvg from '@qc/icons/toggle/full-screen.svg'
import ExitFullscreenSvg from '@qc/icons/toggle/minimize.svg'
import SwitchCamSvg from '@qc/icons/actions/swap-camera.svg'
import CamOffSvg from '@qc/icons/toggle/camera-off.svg'
import CamOnSvg from '@qc/icons/toggle/camera-on.svg'
import MicOffSvg from '@qc/icons/toggle/mic-off.svg'
import MicOnSvg from '@qc/icons/toggle/mic-on.svg'
import { useMobileLayout } from '../../hooks'
import IS_MOBILE from '../../utils/isMobile'
import CameraModal from '../modals/CameraModal'
import useComponent, { CallControlsProps } from './useComponent'
import './styles.css'
import Modal from '../../components/Modal'

export default function CallControls(props: CallControlsProps) {
  const { minimalistic } = props
  const {
    data: { recorderUnavailable, fullscreenEnabled, fullscreen, isOffline },
    store: {
      muteAudio,
      muteVideo,
      screenshare,
      session,
      videoInputSources,
      recording,
    },
    handlers: { toggleFullscreen, toggleSwitchCamera, toggleRecord },
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
    <div
      className={cn('controls', { minimalistic: !fullscreen && minimalistic })}
    >
      {!recorderUnavailable && (
        <button
          className={cn('control-btn', {
            active: recording,
          })}
          disabled={!session || isOffline}
          onClick={toggleRecord}
          title={recording ? t('StopRecord') : t('StartRecord')}
          type="button"
        >
          <div className="record" />
        </button>
      )}
      <button
        className={cn('control-btn', { disable: muteAudio })}
        disabled={!session || isOffline}
        onClick={toggleMuteAudio}
        title={muteAudio ? t('Unmute') : t('Mute')}
        type="button"
      >
        {muteAudio ? (
          <MicOnSvg className="icon" />
        ) : (
          <MicOffSvg className="icon" />
        )}
      </button>
      <button
        className={cn('control-btn', { disable: muteVideo })}
        disabled={!session || isOffline}
        onClick={toggleMuteVideo}
        title={muteVideo ? t('TurnOnCam') : t('TurnOffCam')}
        type="button"
      >
        {muteVideo ? (
          <CamOnSvg className="icon" />
        ) : (
          <CamOffSvg className="icon" />
        )}
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
          className={cn('control-btn', { active: muteVideo || screenshare })}
          disabled={!session || muteVideo || screenshare || isOffline}
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
        {RESOLUTION_XS ||
        (!fullscreen && minimalistic) ||
        (!recorderUnavailable &&
          videoInputSources.length > 1 &&
          fullscreenEnabled) ? (
          <EndCallSvg className="icon" />
        ) : (
          <span>{t('EndCall')}</span>
        )}
      </button>
      {videoInputSources.length > 1 && (
        <Modal>
          <CameraModal />
        </Modal>
      )}
    </div>
  )
}
