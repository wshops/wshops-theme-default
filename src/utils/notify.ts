export function useNotify (options?: NotifyOptions): Notify {
  const notify = new Notify(options)
  window.$notify = notify
  return notify
}

interface NotifyOptions {
  //消息类型
  type?: 'info' | 'success' | 'warn' | 'error' | 'loading'

  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'

  id?: string

  //消息内容
  content?: string

  //消息默认关闭时间（秒）
  duration?: number

  //是否可被主动关闭
  closable?: boolean
}

export class Notify {
  private _options: NotifyOptions

  private readonly _containerId: string = 'wshops-notify-container'

  constructor (options?: NotifyOptions) {
    this._options = {
      type: 'info',
      id: this._generateId(),
      position: 'top-right',
      content: '',
      duration: 3,
      closable: false
    }

    if (options !== undefined && options !== null) {
      if (options.type) {
        this._options.type = options.type
      }

      if (options.content) {
        this._options.content = options.content
      }

      if (options.duration) {
        this._options.duration = options.duration
      }

      if (options.closable !== undefined || options.closable !== null) {
        this._options.closable = options.closable
      }

      if (options.position !== undefined || options.position !== null) {
        this._options.position = options.position
      }
    }

    if (document.getElementById(this._containerId) === undefined || document.getElementById(this._containerId) === null) {
      this._initMessageContainer()
    }
  }

  public duration (duration: number): Notify {
    this._options.duration = duration
    return this
  }

  public closable (): Notify {
    this._options.closable = true
    return this
  }

  public async info (msg: string): Promise<void> {
    this._options.type = 'info'
    this._options.content = msg
    this._showMessage()
    this._resetDefaultOptions()
  }

  public async success (msg: string): Promise<void> {
    this._options.type = 'success'
    this._options.content = msg
    this._showMessage()
    this._resetDefaultOptions()
  }

  public async warn (msg: string): Promise<void> {
    this._options.type = 'warn'
    this._options.content = msg
    this._showMessage()
    this._resetDefaultOptions()
  }

  public async error (msg: string): Promise<void> {
    this._options.type = 'error'
    this._options.content = msg
    this._showMessage()
    this._resetDefaultOptions()
  }

  public loading (msg: string): () => void {
    this._options.type = 'loading'
    this._options.content = msg
    this._options.duration = -1
    this._showMessage()
    const id = this._getId()
    this._resetDefaultOptions()
    const that = this
    let rm = () => {
      that.closeMessage(id)
    }
    return rm
  }

  public closeMessage (msgId: string): void {
    document.getElementById(msgId)?.classList.add('animate-a-fade-out')
    setTimeout(() => {
      document.getElementById(msgId)?.remove()
    }, 500)
  }

  private _resetDefaultOptions () {
    this._options = {
      type: 'info',
      content: '',
      position: 'top-right',
      id: this._generateId(),
      duration: 3,
      closable: false
    }
  }

  private _createMessageElement (): HTMLElement {
    const message = document.createElement('div')
    message.id = this._getId()
    message.className = `flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 animate-a-fade-in-top`
    message.setAttribute('role', 'alert')
    message.innerHTML = `${this._getIcon()}<div class="ml-3 text-sm font-normal">${this._getContent()}</div>${this._getClose()}`
    return message
  }

  private _showMessage (): void {
    const container = this._getMessageContainer()
    const message = this._createMessageElement()
    container.appendChild(message)
    if (this._options.duration! > 0) {
      setTimeout(() => {
        this.closeMessage(message.id)
      }, this._getDurationMs())
    }
  }

  private _generateId (): string {
    return 'notify-' + new Date().getMilliseconds() + Math.floor(Math.random() * 1000)
  }

  private _initMessageContainer () {
    const container = document.createElement('div')
    container.id = this._containerId
    container.className = `${this._getPositionClass()} w-full max-w-xs z-50`
    // container.className = 'notify-container'
    document.body.appendChild<HTMLDivElement>(container)
  }

  private _getMessageContainer (): HTMLElement {
    if (document.getElementById(this._containerId) === undefined || document.getElementById(this._containerId) === null) {
      this._initMessageContainer()
    }
    return document.getElementById(this._containerId)!
  }

  private _getDurationMs (): number {
    if (this._options.duration === undefined) {
      console.error('must specify message duration')
      this._options.content = 'must specify message duration'
      return 2000
    }
    return <number>this._options.duration * 1000
  }

  private _getIcon (): string {
    const map: { [key: string]: string } = {
      'info': `<div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" /></svg> <span class="sr-only">Info icon</span> </div>`,
      'error': `<div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> <span class="sr-only">Error icon</span> </div>`,
      'warn': `<div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> <span class="sr-only">Warning icon</span> </div>`,
      'success': `<div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="sr-only">Check icon</span> </div>`,
      'loading': `<div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 ml-1 text-blue-500 rounded-lg dark:text-blue-200" role="status"><svg class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/> <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/> </svg> <span class="sr-only">Loading...</span></div>`
    }
    return map[this._getType()]
  }

  private _getClose (): string {
    if (this._isClosable()) {
      if (this._getType() === 'loading') return ''
      return `<button type="button" onclick="$notify.closeMessage('${this._getId()}')" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close"> <span class="sr-only">Close</span> <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> </button>`
    }
    return ''
  }

  private _getType (): 'info' | 'success' | 'warn' | 'error' | 'loading' {
    if (this._options.type === undefined) {
      console.error('must specify message type')
      this._options.content = 'must specify message type'
      return 'error'
    }
    return this._options.type!
  }

  private _getPositionClass (): string {
    const map: { [key: string]: string } = {
      'top-left': 'absolute top-5 left-5 ',
      'top-right': 'absolute top-5 right-5',
      'bottom-left': 'absolute bottom-5 left-5',
      'bottom-right': 'absolute right-5 bottom-5',
      'top-center': 'absolute top-5 left-1/2 transform -translate-x-1/2',
    }
    return map[this._options.position!]
  }

  private _getId (): string {
    if (this._options.id === undefined) {
      this._options.id = this._generateId()
      return this._options.id!
    }
    return this._options.id!
  }

  private _getContent (): string {
    if (this._options.content === undefined) {
      console.error('must specify message content')
      this._options.content = 'must specify message content'
      return 'must specify message content'
    }
    return <string>this._options.content
  }

  private _isClosable (): boolean {
    if (this._options.content === undefined) {
      console.error('must specify closable')
      this._options.content = 'must specify closable'
      return false
    }
    return <boolean>this._options.closable
  }
}