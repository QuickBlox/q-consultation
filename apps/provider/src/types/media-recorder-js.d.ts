declare module 'media-recorder-js' {
  interface QBMediaRecorderConstructorProps {
    /** Preferred MIME type */
    mimeType?: string
    workerPath?: string
    /**
     * The minimum number of milliseconds of data to return
     * in a single Blob, fire 'ondataavaible' callback
     * (isn't need to use with 'audio/wav' of 'audio/mp3')
     *
     * @default 1000
     */
    timeslice?: number
    /**
     * What to do with a muted input MediaStreamTrack,
     * e.g. insert black frames/zero audio volume in the recording
     * or ignore altogether
     *
     * @default true
     */
    ignoreMutedMedia?: boolean
    /** Recording start event handler */
    onstart?: VoidFunction
    /** Recording stop event handler */
    onstop?: (file: Blob) => void
    /** Recording pause event handler */
    onpause?: VoidFunction
    /** Recording resume event handler */
    onresume?: VoidFunction
    /** Error event handler */
    onerror?: (error: unknown) => void
    /**
     * `dataavailable` event handler.
     * The Blob of recorded data is contained in this event (callback
     * isn't supported if use 'audio/wav' of 'audio/mp3' for recording)
     */
    ondataavailable?: (event: { data: Blob }) => void
  }

  class QBMediaRecorder {
    constructor(config: QBMediaRecorderConstructorProps)

    /**
     * Switch recording Blob objects to the specified
     * MIME type if `MediaRecorder` support it.
     */
    toggleMimeType(mimeType: string): void

    /**
     * Returns current `MediaRecorder` state
     */
    getState(): 'inactive' | 'recording' | 'paused'

    /**
     * Starts recording a stream.
     * Fires `onstart` callback.
     */
    start(stream: MediaStream): void

    /**
     * Stops recording a stream
     *
     * @fires `onstop` callback and passing there Blob recorded
     */
    stop(): void

    /** Pausing stream recording */
    pause(): void

    /** Resumes stream recording */
    resume(): void

    /**
     * Change record source
     */
    change(stream: MediaStream): void

    /**
     * Create a file from blob and download as file.
     * This method will call `stop` if recording is in progress.
     *
     * @param {string} filename Name of video file to be downloaded
     * (default to `Date.now()`)
     */
    download(filename?: string): void

    _getBlobRecorded(): Blob

    callbacks: Pick<
      QBMediaRecorderConstructorProps,
      | 'onstart'
      | 'onstop'
      | 'onpause'
      | 'onresume'
      | 'ondataavailable'
      | 'onerror'
    >

    /**
     * Checks capability of recording in the environment.
     * Checks `MediaRecorder`, `MediaRecorder.isTypeSupported` and `Blob`.
     */
    static isAvailable(): boolean

    /**
     * Checks if AudioContext API is available.
     * Checks `window.AudioContext` or `window.webkitAudioContext`.
     */
    static isAudioContext(): boolean
    /**
     * The `QBMediaRecorder.isTypeSupported()` static method returns
     * a Boolean which is true if the MIME type specified is one
     * the user agent should be able to successfully record.
     * @param mimeType The MIME media type to check.
     *
     * @returns true if the `MediaRecorder` implementation is capable of
     * recording `Blob` objects for the specified MIME type. Recording may
     * still fail if there are insufficient resources to support the
     * recording and encoding process. If the value is false, the user
     * agent is incapable of recording the specified format.
     */

    static isTypeSupported(mimeType: string): boolean

    /**
     * Return supported mime types
     * @param type video or audio (dafault to 'video')
     */
    static getSupportedMimeTypes(type: 'audio' | 'video' = 'video'): string[]
  }

  export default QBMediaRecorder
}
